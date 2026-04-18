import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { SuggestionsService } from './suggestions.service';

@ApiTags('Suggestions')
@ApiBearerAuth()
@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateSuggestionDto) {
    return this.suggestionsService.create(user.id, dto);
  }
}
