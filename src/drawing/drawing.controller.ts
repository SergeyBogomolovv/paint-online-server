import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('drawing')
export class DrawingController {
  constructor(private readonly drawingService: DrawingService) {}
  @Get(':title')
  async getBoard(@Param('title') title: string) {
    const board = await this.drawingService.findByKey(title);
    return board;
  }
  @UseInterceptors(FileInterceptor('image'))
  @Put()
  async saveData(
    @Body('title') title: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.drawingService.updateBoard(title, file);
  }
}
