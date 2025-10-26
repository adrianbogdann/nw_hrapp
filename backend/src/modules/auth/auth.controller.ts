import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ROLES } from '../../constants/roles';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(ROLES.MANAGER)
  @Get('manager-test')
  getManagerTest() {
    return { ok: true, role: 'manager' };
  }
}
