import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateReviewDto) {
    return this.prisma.review.upsert({
      where: { userId_courseId: { userId, courseId: dto.courseId } },
      update: { rating: dto.rating, comment: dto.comment },
      create: { userId, courseId: dto.courseId, rating: dto.rating, comment: dto.comment },
    });
  }

  byCourse(courseId: string) {
    return this.prisma.review.findMany({
      where: { courseId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
