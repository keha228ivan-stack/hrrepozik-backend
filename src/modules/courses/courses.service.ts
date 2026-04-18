import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { QueryCoursesDto } from './dto/query-courses.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCourses(query: QueryCoursesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = {
      isPublished: true,
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' as const } },
              { description: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.difficulty ? { difficulty: query.difficulty } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.course.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.course.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  getById(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: { include: { lessons: { include: { materials: true }, orderBy: { sortOrder: 'asc' } } }, orderBy: { sortOrder: 'asc' } },
        tests: true,
        assignments: true,
      },
    });
  }

  recommended(userId: string) {
    return this.prisma.course.findMany({ where: { isPublished: true }, take: 5, orderBy: { createdAt: 'desc' } });
  }

  inProgress(userId: string) {
    return this.prisma.userCourseProgress.findMany({
      where: { userId, status: 'IN_PROGRESS' },
      include: { course: true, currentLesson: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  newest() {
    return this.prisma.course.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 10 });
  }

  async start(userId: string, courseId: string) {
    return this.prisma.userCourseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { status: 'IN_PROGRESS', startedAt: new Date() },
      create: { userId, courseId, status: 'IN_PROGRESS', startedAt: new Date(), progressPercent: 0 },
    });
  }

  pause(userId: string, courseId: string) {
    return this.prisma.userCourseProgress.update({ where: { userId_courseId: { userId, courseId } }, data: { status: 'PAUSED' } });
  }

  resume(userId: string, courseId: string) {
    return this.prisma.userCourseProgress.update({ where: { userId_courseId: { userId, courseId } }, data: { status: 'IN_PROGRESS' } });
  }

  progress(userId: string, courseId: string) {
    return this.prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { course: true, currentLesson: true },
    });
  }

  modules(courseId: string) {
    return this.prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: { include: { materials: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
