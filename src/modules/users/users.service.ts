import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateMeDto } from './dto/update-me.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        position: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        department: true,
      },
    });
  }

  updateMe(userId: string, dto: UpdateMeDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        position: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        department: true,
      },
    });
  }

  async myStats(userId: string) {
    const [courseCount, completedCount, certCount, achievements] = await Promise.all([
      this.prisma.userCourseProgress.count({ where: { userId } }),
      this.prisma.userCourseProgress.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.certificate.count({ where: { userId } }),
      this.prisma.userAchievement.count({ where: { userId } }),
    ]);

    return { courseCount, completedCount, certCount, achievements };
  }
}
