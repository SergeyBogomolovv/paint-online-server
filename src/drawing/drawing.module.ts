import { Module } from '@nestjs/common';
import { DrawingService } from './drawing.service';
import { DrawingGateway } from './drawing.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DrawingController } from './drawing.controller';

@Module({
  imports: [PrismaModule],
  providers: [DrawingGateway, DrawingService],
  controllers: [DrawingController],
})
export class DrawingModule {}
