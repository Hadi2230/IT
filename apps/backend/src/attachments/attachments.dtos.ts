import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @IsInt()
  sizeBytes!: number;

  @IsString()
  @IsNotEmpty()
  storageKey!: string;
}

