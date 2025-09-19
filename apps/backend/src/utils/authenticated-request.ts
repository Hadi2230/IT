import { Request } from 'express';
import { AppRole } from './roles.decorator';

export interface AuthenticatedUserPayload {
  userId: string;
  role: AppRole;
  email: string;
}

export type AuthenticatedRequest = Request & { user: AuthenticatedUserPayload };
