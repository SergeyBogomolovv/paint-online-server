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
    client.join(message.title);
    client.broadcast.to([...client.rooms]).emit('connection', {
      message: `Пользователь ${message.name} подключился`,
    });
  }
  @SubscribeMessage('draw')
  draw(@MessageBody() message: Drawing, @ConnectedSocket() client: Socket) {
    client.emit(message.type, message.figure);
    client.broadcast.to([...client.rooms]).emit(message.type, message.figure);
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
