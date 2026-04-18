import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { AssignmentsService } from './assignments.service';

@ApiTags('Assignments')
@ApiBearerAuth()
@Controller()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('courses/:id/assignments')
  byCourse(@Param('id') id: string) {
    return this.assignmentsService.byCourse(id);
  }

  @Post('assignments/:id/submit')
  submit(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: SubmitAssignmentDto) {
    return this.assignmentsService.submit(user.id, id, dto);
  }
}
