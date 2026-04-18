import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  getProgress(@CurrentUser() user: { id: string }) {
    return this.progressService.getProgress(user.id);
  }
}
