import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  actorId?: string;

  @IsString()
  @IsNotEmpty()
  action!: string;

  @IsString()
  @IsNotEmpty()
  entity!: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  // metadata is Json in DB; accept as any object
  @IsOptional()
  metadata?: unknown;
}

