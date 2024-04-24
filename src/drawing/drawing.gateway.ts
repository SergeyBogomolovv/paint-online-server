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
  async connect(
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
  @SubscribeMessage('save')
  async save(
    @MessageBody() data: SaveDataEntity,
    @ConnectedSocket() client: Socket,
  ) {
    await this.drawingService.pushToUndo(data.id, data.data);
    client.broadcast.emit('save', data.data);
    client.emit('save', data.data);
  }
  @SubscribeMessage('undo')
  async undo(
    @ConnectedSocket() client: Socket,
    @MessageBody('key') key: string,
  ) {
    client.broadcast.emit('undo');
    client.emit('undo');
    await this.drawingService.undo(key);
  }
  @SubscribeMessage('redo')
  async redo(
    @ConnectedSocket() client: Socket,
    @MessageBody('key') key: string,
  ) {
    client.broadcast.emit('redo');
    client.emit('redo');
    await this.drawingService.redo(key);
  }
}
