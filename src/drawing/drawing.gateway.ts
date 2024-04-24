import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { DrawingService } from './drawing.service';
import { Server, Socket } from 'socket.io';
import { Drawing } from './entities/drawing.entity';
import { ConnectionEntity } from './entities/connection.entity';
import { SaveDataEntity } from './entities/save-data-entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class DrawingGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly drawingService: DrawingService) {}
  @SubscribeMessage('connection')
  connect(
    @MessageBody() message: ConnectionEntity,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(message.id);
    client.broadcast.emit('connection', {
      message: `Пользователь ${message.name} подключился`,
    });
  }
  @SubscribeMessage('draw')
  draw(@MessageBody() message: Drawing, @ConnectedSocket() client: Socket) {
    client.emit(message.type, message.figure);
    client.broadcast.emit(message.type, message.figure);
  }
  @SubscribeMessage('finish')
  finish(@ConnectedSocket() client: Socket) {
    client.broadcast.emit('finish');
    client.emit('finish');
  }
  @SubscribeMessage('push')
  push(@MessageBody() data: SaveDataEntity, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('push', data.data);
    client.emit('push', data.data);
  }
  @SubscribeMessage('undo')
  undo(@ConnectedSocket() client: Socket) {
    client.broadcast.emit('undo');
    client.emit('undo');
  }
  @SubscribeMessage('redo')
  redo(@ConnectedSocket() client: Socket) {
    client.broadcast.emit('redo');
    client.emit('redo');
  }
  @SubscribeMessage('save')
  save(@MessageBody() data: SaveDataEntity) {
    this.drawingService.updateBoard(data.id, data.data);
  }
}
