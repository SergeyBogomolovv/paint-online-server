import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { SaveDataEntity } from './entities/save-data-entity';

@Controller('drawing')
export class DrawingController {
  constructor(private readonly drawingService: DrawingService) {}
  @Get(':id')
  async getBoard(@Param('id') id: string) {
    const board = await this.drawingService.findByKey(id);
    return board;
  }
  @Post()
  createBoard(@Body() data: CreateBoardDto) {
    this.drawingService.createBoard(data);
  }
  @Put()
  async saveData(@Body() data: SaveDataEntity) {
    await this.drawingService.updateBoard(data.id, data.data);
  }
}
