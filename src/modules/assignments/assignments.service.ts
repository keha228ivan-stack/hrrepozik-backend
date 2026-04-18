import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  byCourse(courseId: string) {
    return this.prisma.assignment.findMany({ where: { courseId }, orderBy: { dueDate: 'asc' } });
  }

  submit(userId: string, assignmentId: string, dto: SubmitAssignmentDto) {
    return this.prisma.assignmentSubmission.upsert({
      where: { assignmentId_userId: { assignmentId, userId } },
      update: { content: dto.content, submittedAt: new Date() },
      create: { assignmentId, userId, content: dto.content },
    });
  }
}
