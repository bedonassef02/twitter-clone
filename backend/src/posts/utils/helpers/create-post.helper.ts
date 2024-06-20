import { CreatePostDto } from '../../dto/create-post.dto';
import { BadRequestException } from '@nestjs/common';
import { NotificationDto } from '../../../notifications/dto/notification.dto';

export function checkIfPostEmpty(createPostDto: CreatePostDto) {
  if (
    !createPostDto.content &&
    !createPostDto.images &&
    !createPostDto.repost
  ) {
    throw new BadRequestException("you can't create empty post");
  }
}

export function checkPostType(createPostDto: CreatePostDto) {
  if (createPostDto.repost && createPostDto.type !== 'comment') {
    createPostDto.type = 'repost';
  }
}

export function createPostNotification(
  createPostDto: CreatePostDto,
): NotificationDto {
  return {
    post: createPostDto.repost,
    from: createPostDto.user,
    type: createPostDto.type || 'repost',
    user: createPostDto.user,
  };
}
