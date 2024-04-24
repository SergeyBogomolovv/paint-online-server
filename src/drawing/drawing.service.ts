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
          title: title,
          data: '',
        },
      });
      return newBoard;
    }
    return board;
  }
  async updateBoard(title: string, file: Express.Multer.File) {
    await this.prisma.board.update({
      where: { title },
      data: { data: `data:image/png;base64,${file.buffer.toString('base64')}` },
    });
  }
}
