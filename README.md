<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo APP
Curso de NestJS con base de datos en Postgres

1. Clonar el proyecto
2. instalar dependencias 
```shell
yarn install
```
3. Copiar el archivo ```.env.template``` a ```.env```
```shell
cp .env.template .env
```
4. Modificar las variables de entorno de ser necesario en el archivo ```.env```
5. Levantar base de datos
```shell
docker-compose up -d
```
6. Levantar proyecto en modo desarrollo
```shell
yarn start:dev
```
7. Llenar la base de datos con información de productos mediante el seed
```shell
curl -o /dev/null http://localhost:9000/api/seed/
```