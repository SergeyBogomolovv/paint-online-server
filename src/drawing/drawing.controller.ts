import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { CreateBoardDto } from './dto/create-board.dto';

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
}
