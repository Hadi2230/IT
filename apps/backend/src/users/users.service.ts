import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { fullName: string; email: string; password: string; role?: 'ADMIN' | 'IT_AGENT' | 'EMPLOYEE' }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { fullName: data.fullName, email: data.email, passwordHash, role: data.role ?? 'EMPLOYEE' } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, include: { assets: true } });
  }
}

