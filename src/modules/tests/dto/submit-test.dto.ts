import { IsArray, IsString } from 'class-validator';

export class SubmitTestDto {
  @IsArray()
  answers!: Array<{ questionId: string; answerIds: string[] }>;

  @IsString()
  startedAt!: string;
}
