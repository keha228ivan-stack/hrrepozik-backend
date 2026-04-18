import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}

  listTopics() {
    return this.prisma.forumTopic.findMany({
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, course: true, _count: { select: { messages: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  createTopic(userId: string, dto: CreateTopicDto) {
    return this.prisma.forumTopic.create({
      data: { authorId: userId, title: dto.title, content: dto.content, courseId: dto.courseId },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, course: true },
    });
  }

  getTopic(id: string) {
    return this.prisma.forumTopic.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        messages: { include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' } },
      },
    });
  }

  createMessage(userId: string, topicId: string, dto: CreateMessageDto) {
    return this.prisma.forumMessage.create({
      data: { topicId, authorId: userId, content: dto.content },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
  }
}
