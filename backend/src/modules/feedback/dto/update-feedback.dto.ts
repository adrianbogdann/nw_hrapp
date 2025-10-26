import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  content?: string;

  // If true and content is provided, re-run polish on updated content
  @IsOptional()
  @IsBoolean()
  repolish?: boolean;
}
