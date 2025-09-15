import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TicketPriorityDto {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsEnum(TicketPriorityDto)
  priority!: TicketPriorityDto;

  @IsString()
  @IsNotEmpty()
  requesterId!: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}

