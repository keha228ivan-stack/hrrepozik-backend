import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateSuggestionDto) {
    return this.prisma.courseSuggestion.create({ data: { userId, title: dto.title, description: dto.description } });
  }
}
