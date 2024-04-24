import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DrawingService {
  constructor(private readonly prisma: PrismaService) {}
  async findByKey(title: string) {
    const board = await this.prisma.board.findUnique({ where: { title } });
    if (!board) {
      const newBoard = await this.prisma.board.create({
        data: {
          data: '',
          title: title,
        },
      });
      return newBoard;
    }
    return board;
  }
  async updateBoard(title: string, data: string) {
    await this.prisma.board.update({
      where: { title },
      data: { data },
    });
  }
}
