import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { ForumService } from './forum.service';

@ApiTags('Forum')
@ApiBearerAuth()
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Get('topics')
  topics() {
    return this.forumService.listTopics();
  }

  @Post('topics')
  createTopic(@CurrentUser() user: { id: string }, @Body() dto: CreateTopicDto) {
    return this.forumService.createTopic(user.id, dto);
  }

  @Get('topics/:id')
  getTopic(@Param('id') id: string) {
    return this.forumService.getTopic(id);
  }

  @Post('topics/:id/messages')
  createMessage(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: CreateMessageDto) {
    return this.forumService.createMessage(user.id, id, dto);
  }
}
