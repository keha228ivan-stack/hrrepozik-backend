import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(3)
  content!: string;

  @IsOptional()
  @IsString()
  courseId?: string;
}
