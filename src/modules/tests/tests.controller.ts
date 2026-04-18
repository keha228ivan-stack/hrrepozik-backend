import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubmitTestDto } from './dto/submit-test.dto';
import { TestsService } from './tests.service';

@ApiTags('Tests')
@ApiBearerAuth()
@Controller()
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get('courses/:id/tests')
  courseTests(@Param('id') id: string) {
    return this.testsService.courseTests(id);
  }

  @Get('tests/:id')
  getById(@Param('id') id: string) {
    return this.testsService.getTest(id);
  }

  @Post('tests/:id/submit')
  submit(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: SubmitTestDto) {
    return this.testsService.submit(user.id, id, dto);
  }

  @Get('tests/:id/attempts')
  attempts(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.testsService.attempts(user.id, id);
  }
}
