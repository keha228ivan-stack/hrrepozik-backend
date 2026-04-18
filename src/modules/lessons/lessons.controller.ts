import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.lessonsService.getLesson(id);
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.lessonsService.complete(user.id, id);
  }
}
