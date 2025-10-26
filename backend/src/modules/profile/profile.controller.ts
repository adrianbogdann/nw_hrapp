import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
  Patch,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../../constants/roles';
import { ProfileService } from './profile.service';
import { PROFILE_FIELDS_PUBLIC } from '../../constants/profile';

@UseGuards(JwtAuthGuard)
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':userId')
  async getProfile(@Param('userId') userId: number, @Request() req: any) {
    const requester = req.user;

    // Manager or self -> full data
    if (requester.role === ROLES.MANAGER || requester.id === +userId) {
      return this.profileService.findByUserId(userId);
    }

    // Coworker -> only public fields
    if (requester.role === ROLES.COWORKER) {
      const profile = await this.profileService.findByUserId(userId);
      if (!profile) return null;
      return Object.fromEntries(
        Object.entries(profile).filter(([k]) =>
          PROFILE_FIELDS_PUBLIC.includes(k as any),
        ),
      );
    }

    throw new ForbiddenException('Not authorized to view this profile');
  }

  @Patch(':userId')
  @Roles(ROLES.MANAGER, ROLES.EMPLOYEE)
  async updateProfile(
    @Param('userId') userId: number,
    @Body() body: Record<string, any>,
    @Request() req: any,
  ) {
    const requester = req.user;
    if (requester.role === ROLES.MANAGER || requester.id === +userId) {
      return this.profileService.updateProfile(userId, body);
    }
    throw new ForbiddenException('Cannot edit this profile');
  }
}
