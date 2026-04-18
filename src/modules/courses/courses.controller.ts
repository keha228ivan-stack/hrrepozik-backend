import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { CoursesService } from './courses.service';

@ApiTags('Courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.getCourses(query);
  }

  @Get('recommended')
  recommended(@CurrentUser() user: { id: string }) {
    return this.coursesService.recommended(user.id);
  }

  @Get('in-progress')
  inProgress(@CurrentUser() user: { id: string }) {
    return this.coursesService.inProgress(user.id);
  }

  @Get('new')
  newest() {
    return this.coursesService.newest();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.coursesService.getById(id);
  }

  @Post(':id/start')
  start(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.coursesService.start(user.id, id);
  }

  @Post(':id/pause')
  pause(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.coursesService.pause(user.id, id);
  }

  @Post(':id/resume')
  resume(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.coursesService.resume(user.id, id);
  }

  @Get(':id/progress')
  progress(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.coursesService.progress(user.id, id);
  }

  @Get(':id/modules')
  modules(@Param('id') id: string) {
    return this.coursesService.modules(id);
  }
}
