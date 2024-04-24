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
          key: dto.key,
        },
      });
      return board;
    } catch (error) {
      console.log('error');
    }
  }
  async undo(key: string) {
    const board = await this.prisma.board.findUnique({ where: { key } });
    if (board.undoList.length > 0) {
      const last = board.undoList.pop();
      board.redoList = [...board.redoList, last];
      board.data = last;
      await this.prisma.board.update({ where: { key }, data: { ...board } });
    }
  }
  async redo(key: string) {
    const board = await this.prisma.board.findUnique({ where: { key } });
    if (board.redoList.length > 0) {
      const last = board.redoList.pop();
      board.undoList = [...board.undoList, last];
      board.data = last;
      await this.prisma.board.update({ where: { key }, data: { ...board } });
    }
  }
  async findByKey(key: string) {
    return await this.prisma.board.findUnique({ where: { key } });
  }
  async updateBoard(key: string, data: string) {
    await this.prisma.board.update({
      where: { key },
      data: { data },
    });
  }
  async pushToUndo(key: string, data: string) {
    await this.prisma.board.update({
      where: { key },
      data: { undoList: { push: data } },
    });
  }
}
