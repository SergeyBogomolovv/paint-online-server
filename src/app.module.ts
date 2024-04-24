import { Module } from '@nestjs/common';
import { DrawingModule } from './drawing/drawing.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [DrawingModule, PrismaModule],
})
export class AppModule {}
