import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  courseHistory(userId: string) {
    return this.prisma.userCourseProgress.findMany({
      where: { userId },
      include: { course: true },
      orderBy: { startedAt: 'desc' },
    });
  }
}
