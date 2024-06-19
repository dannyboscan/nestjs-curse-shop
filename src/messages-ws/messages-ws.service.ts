import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ConnectedClients } from './interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MessagesWsService {
	private connectedClients: ConnectedClients = {};

	constructor(private readonly authService: AuthService) {}

	async registerClient(client: Socket, userId: string): Promise<void> {
		const user = await this.authService.getUser(userId);

		if (!user) throw new Error('User not found');
		if (!user.isActive) throw new Error('User not active');

		this.connectedClients[client.id] = { socket: client, user };
	}

	removeClient(client: Socket): void {
		delete this.connectedClients[client.id];
	}

	getConnectedClients(): string[] {
		return Object.keys(this.connectedClients);
	}

	getUserFullName(socketId: string) {
		return this.connectedClients[socketId].user.fullName;
	}
}
