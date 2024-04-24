import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { SaveDataEntity } from './entities/save-data-entity';

@Controller('drawing')
export class DrawingController {
  constructor(private readonly drawingService: DrawingService) {}
  @Get(':title')
  async getBoard(@Param('title') title: string) {
    const board = await this.drawingService.findByKey(title);
    return board;
  }
  @Put()
  async saveData(@Body() data: SaveDataEntity) {
    await this.drawingService.updateBoard(data.title, data.data);
  }
}
