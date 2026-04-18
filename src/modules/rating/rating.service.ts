import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const completed = await this.prisma.userCourseProgress.count({ where: { userId, status: 'COMPLETED' } });
    const attempts = await this.prisma.testAttempt.findMany({ where: { userId } });
    const avgScore = attempts.length ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0;

    return {
      userId,
      points: completed * 100 + avgScore,
      completedCourses: completed,
      averageTestScore: avgScore,
    };
  }
}
