import { Injectable } from '@nestjs/common';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { UpdateDrawingDto } from './dto/update-drawing.dto';

@Injectable()
export class DrawingService {
  create(createDrawingDto: CreateDrawingDto) {
    return 'This action adds a new drawing';
  }

  findAll() {
    return `This action returns all drawing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} drawing`;
  }

  update(id: number, updateDrawingDto: UpdateDrawingDto) {
    return `This action updates a #${id} drawing`;
  }

  remove(id: number) {
    return `This action removes a #${id} drawing`;
  }
}
