import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWorklogDto {
  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  itUserId!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hours?: number;
}

