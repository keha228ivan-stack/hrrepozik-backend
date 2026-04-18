import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RatingService } from './rating.service';

@ApiTags('Rating')
@ApiBearerAuth()
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('me')
  me(@CurrentUser() user: { id: string }) {
    return this.ratingService.me(user.id);
  }
}
