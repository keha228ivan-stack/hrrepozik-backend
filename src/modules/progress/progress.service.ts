import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  getProgress(userId: string) {
    return this.prisma.userCourseProgress.findMany({ where: { userId }, include: { course: true, currentLesson: true } });
  }
}
