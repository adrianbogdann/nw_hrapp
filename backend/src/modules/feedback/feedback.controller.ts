import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  Patch, 
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { ROLES } from '../../constants/roles';

@UseGuards(JwtAuthGuard)
@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Roles(ROLES.COWORKER)
  @Post('/:toUserId')
  async leaveFeedback(
    @Param('toUserId') toUserId: number,
    @Body() body: { content: string; polish?: boolean },
    @Request() req: any,
  ) {
    const { content, polish } = body;
    if (!content) throw new BadRequestException('Feedback content is required');
    return this.feedbackService.createFeedback(req.user.id, +toUserId, content, polish);
  }

  @Get('/:toUserId')
  async listFeedback(@Param('toUserId') toUserId: number) {
    return this.feedbackService.getFeedbackForUser(+toUserId);
  }
  @Get('/mine/list')
  async mine(@Request() req: any) {
    return this.feedbackService.findGivenByUser(req.user.id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Request() req: any, @Body() dto: UpdateFeedbackDto) {
    return this.feedbackService.updateFeedback(Number(id), req.user.id, req.user.role, dto);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number, @Request() req: any) {
    return this.feedbackService.deleteFeedback(Number(id), req.user.id, req.user.role);
  }
}
