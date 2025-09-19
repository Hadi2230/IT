import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type AppRole = 'ADMIN' | 'IT_AGENT' | 'EMPLOYEE';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
