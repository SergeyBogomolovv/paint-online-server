import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { DrawingService } from './drawing.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class DrawingGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly drawingService: DrawingService) {}

  @SubscribeMessage('connection')
  connect(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    client.join(message.id);
    client.broadcast.emit(
      'connection',
      `Пользователь ${message.name} подключился`,
    );
    return `Пользователь ${message.name} подключился`;
  }

  @SubscribeMessage('draw')
  draw(@MessageBody() message: any) {
    this.server.emit('connection', message);
    return message;
  }

  @SubscribeMessage('finish')
  finish(@MessageBody() message: any) {
    this.server.emit('connection', message);
    return message;
  }

  @SubscribeMessage('action')
  action(@MessageBody() message: any) {
    this.server.emit('connection', message);
    return message;
  }
}
