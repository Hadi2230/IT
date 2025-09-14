import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ListLicensesQueryDto {
  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsString()
  vendor?: string;
}

export class CreateSoftwareLicenseDto {
  @IsString()
  @IsNotEmpty()
  product!: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsString()
  licenseKey?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  seatsTotal?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  seatsUsed?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  assetId?: string;
}

