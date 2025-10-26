import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AbsenceService } from './absence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../../constants/roles';

@UseGuards(JwtAuthGuard)
@Controller('api/absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Roles(ROLES.EMPLOYEE)
  @Post()
  async requestAbsence(
    @Body() body: { start_date: string; end_date: string; reason: string },
    @Request() req: any,
  ) {
    const { start_date, end_date, reason } = body;
    if (!start_date || !end_date || !reason)
      throw new ForbiddenException('All fields required');
    return this.absenceService.createAbsence(req.user.id, { start_date, end_date, reason });
  }

  @Get('me')
  async myAbsences(@Request() req: any) {
    return this.absenceService.getForUser(req.user.id);
  }

  @Roles(ROLES.MANAGER)
  @Get()
  async allAbsences() {
    return this.absenceService.getAll();
  }

  @Roles(ROLES.MANAGER)
  @Patch(':id')
  async updateStatus(@Param('id') id: number, @Body() body: { status: 'approved' | 'rejected' }) {
    return this.absenceService.updateStatus(id, body.status);
  }
}
