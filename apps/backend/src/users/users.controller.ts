import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService, private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: { fullName: string; email: string; password: string }) {
    const user = await this.users.createUser(body);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.auth.validateUser(body.email, body.password);
    return this.auth.login(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.users.getProfile(req.user.userId);
  }
}

