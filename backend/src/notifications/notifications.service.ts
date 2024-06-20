import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { Model } from 'mongoose';
import { NotificationDto } from './dto/notification.dto';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  findAll(user: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ user });
  }

  findCount(user: string): Promise<number> {
    return this.notificationModel.countDocuments({ user, seen: false });
  }
  @OnEvent('notification.create')
  create(
    createNotificationDto: NotificationDto,
  ): Promise<NotificationDocument> {
    return this.notificationModel.create(createNotificationDto);
  }
}
