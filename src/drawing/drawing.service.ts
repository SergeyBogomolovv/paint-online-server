import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class DrawingService {
  constructor(private readonly prisma: PrismaService) {}
  async createBoard(dto: CreateBoardDto) {
    try {
      const board = await this.prisma.board.create({
        data: {
          data: dto.data,
          redoList: dto.redoList,
          undoList: dto.undoList,
          key: dto.key,
        },
      });
      return board;
    } catch (error) {
      console.log('erefsdf');
    }
  }
  findByKey(key: string) {
    return this.prisma.board.findUnique({ where: { key } });
  }
  setUndo(id: string, value: any) {
    return this.prisma.board.update({
      where: { key: id },
      data: { undoList: value },
    });
  }
  setRedo(id: string, value: any) {
    return this.prisma.board.update({
      where: { key: id },
      data: { redoList: value },
    });
  }
  async updateBoard(key: string, data: string) {
    return await this.prisma.board.update({ where: { key }, data: { data } });
  }
}
