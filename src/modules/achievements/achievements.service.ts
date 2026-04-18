import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.userAchievement.findMany({ where: { userId }, include: { achievement: true }, orderBy: { awardedAt: 'desc' } });
  }
}
