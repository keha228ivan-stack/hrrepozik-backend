import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLesson(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id }, include: { materials: true, module: true } });
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }

  async complete(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: true } });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const courseId = lesson.module.courseId;
    const progress = await this.prisma.userCourseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { currentLessonId: lessonId, status: 'IN_PROGRESS' },
      create: {
        userId,
        courseId,
        currentLessonId: lessonId,
        progressPercent: 0,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    const totalLessons = await this.prisma.lesson.count({ where: { module: { courseId } } });
    const lessons = await this.prisma.lesson.findMany({ where: { module: { courseId } }, orderBy: { sortOrder: 'asc' }, select: { id: true } });
    const completedIndex = Math.max(0, lessons.findIndex((l) => l.id === lessonId) + 1);
    const percent = totalLessons === 0 ? 0 : Math.min(100, Math.round((completedIndex / totalLessons) * 100));

    return this.prisma.userCourseProgress.update({
      where: { id: progress.id },
      data: {
        progressPercent: percent,
        ...(percent >= 100 ? { status: 'COMPLETED', completedAt: new Date() } : {}),
      },
    });
  }
}
