import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Drawing } from './entities/drawing.entity';
import { ConnectionEntity } from './entities/connection.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class DrawingGateway {
  @WebSocketServer()
  server: Server;
  constructor() {}
  @SubscribeMessage('connection')
  connect(
    @MessageBody() message: ConnectionEntity,
    @ConnectedSocket() client: Socket,
  ) {
    client.data.name = message.name;
    client.join(message.title);
    const users = [];
    this.server.sockets.adapter.rooms.get(message.title).forEach((id) => {
      const socket = this.server.sockets.sockets.get(id);
      users.push({ id: socket.id, name: socket.data.name });
    });
    client.on('disconnect', () => {
      client.broadcast.to([...client.rooms]).emit('disconnection', {
        name: message.name,
        id: client.id,
      });
    });
    client.emit('connection', { users, name: message.name });
    client.broadcast.to([...client.rooms]).emit('connection', {
      users,
      name: message.name,
    });
  }
  @SubscribeMessage('draw')
  draw(@MessageBody() message: Drawing, @ConnectedSocket() client: Socket) {
    client.broadcast.to([...client.rooms]).emit(message.type, message.figure);
    client.emit(message.type, message.figure);
  }
  @SubscribeMessage('finish')
  finish(@ConnectedSocket() client: Socket) {
    client.broadcast.to([...client.rooms]).emit('finish');
    client.emit('finish');
  }
  @SubscribeMessage('save')
  push(@ConnectedSocket() client: Socket) {
    client.broadcast.to([...client.rooms]).emit('save');
    client.emit('save');
  }
  @SubscribeMessage('undo')
  undo(@ConnectedSocket() client: Socket) {
    client.broadcast.to([...client.rooms]).emit('undo');
    client.emit('undo');
  }
  @SubscribeMessage('redo')
  redo(@ConnectedSocket() client: Socket) {
    client.broadcast.to([...client.rooms]).emit('redo');
    client.emit('redo');
  }
}
