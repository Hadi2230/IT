import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRemoteSessionDto {
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(240)
  expiresInMinutes?: number;
}

export class ConnectByCodeDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export enum RemoteSocketRole {
  REQUESTER = 'REQUESTER',
  AGENT = 'AGENT',
}

export class ConnectTokenResponseDto {
  token!: string;
  expiresInSeconds!: number;
}

