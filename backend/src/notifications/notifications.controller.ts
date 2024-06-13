import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationDocument } from './entities/notification.entity';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@User('id') user: string): Promise<NotificationDocument[]> {
    return this.notificationsService.findAll(user);
  }
}
