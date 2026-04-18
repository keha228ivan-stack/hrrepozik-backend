import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.certificate.findMany({ where: { userId }, include: { course: true }, orderBy: { issuedAt: 'desc' } });
  }
}
