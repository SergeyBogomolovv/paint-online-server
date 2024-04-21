import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrawingModule } from './drawing/drawing.module';

@Module({
  imports: [DrawingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
