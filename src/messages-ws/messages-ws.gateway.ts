import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { WsEvents } from './interfaces';
import { ClientMessageDto } from './dtos/client-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true, namespace: '/messages' })
export class MessagesWsGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() wss: Server;

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService,
	) {}

	clientsUpdate() {
		this.wss.emit(
			WsEvents.CLIENTS_UPDATED,
			this.messagesWsService.getConnectedClients(),
		);
	}

	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authorization;
		let jwtPayload: JwtPayload;

		try {
			jwtPayload = this.jwtService.verify(token);
			await this.messagesWsService.registerClient(client, jwtPayload.id);
			this.clientsUpdate();
		} catch (error) {
			client.disconnect();
			throw new WsException(error.message);
		}

		console.log(jwtPayload);
	}

	handleDisconnect(client: Socket) {
		this.messagesWsService.removeClient(client);
		this.clientsUpdate();
	}

	@SubscribeMessage(WsEvents.CLIENT_MESSAGE)
	onClientMessage(client: Socket, payload: ClientMessageDto) {
		// * Emitir solo al cliente emisor
		// client.emit(WsEvents.SERVER_MESSAGE, {
		// 	fullName: client.id,
		// 	message: payload.message,
		// });

		// * Emitir a todos menos al emisor
		// client.broadcast.emit(WsEvents.SERVER_MESSAGE, {
		// 	fullName: client.id,
		// 	message: payload.message,
		// });

		// * Emitir a todo el mundo
		this.wss.emit(WsEvents.SERVER_MESSAGE, {
			fullName: this.messagesWsService.getUserFullName(client.id),
			message: payload.message,
		});
	}
}
