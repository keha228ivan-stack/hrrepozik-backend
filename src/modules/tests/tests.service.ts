import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class TestsService {
  constructor(private readonly prisma: PrismaService) {}

  courseTests(courseId: string) {
    return this.prisma.test.findMany({ where: { courseId }, include: { questions: { include: { answers: true } } } });
  }

  async getTest(id: string) {
    const test = await this.prisma.test.findUnique({ where: { id }, include: { questions: { include: { answers: true } } } });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async submit(userId: string, testId: string, dto: SubmitTestDto) {
    const test = await this.getTest(testId);
    const attemptsCount = await this.prisma.testAttempt.count({ where: { userId, testId } });
    const attemptNumber = attemptsCount + 1;
    if (attemptNumber > test.maxAttempts) throw new BadRequestException('Maximum attempts reached');

    const correctMap = new Map<string, string[]>();
    test.questions.forEach((q) => {
      correctMap.set(
        q.id,
        q.answers.filter((a) => a.isCorrect).map((a) => a.id),
      );
    });

    let correct = 0;
    dto.answers.forEach((entry) => {
      const expected = [...(correctMap.get(entry.questionId) || [])].sort();
      const actual = [...entry.answerIds].sort();
      if (expected.length === actual.length && expected.every((id, i) => id === actual[i])) {
        correct += 1;
      }
    });

    const score = Math.round((correct / Math.max(1, test.questions.length)) * 100);
    const passed = score >= test.passingScore;

    return this.prisma.testAttempt.create({
      data: {
        userId,
        testId,
        score,
        passed,
        attemptNumber,
        startedAt: new Date(dto.startedAt),
        finishedAt: new Date(),
      },
    });
  }

  attempts(userId: string, testId: string) {
    return this.prisma.testAttempt.findMany({ where: { userId, testId }, orderBy: { attemptNumber: 'desc' } });
  }
}
