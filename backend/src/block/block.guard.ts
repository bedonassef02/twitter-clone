import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { BlockService } from './block.service';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class BlockGuard implements CanActivate {

  constructor(
      private readonly blockService: BlockService,
      private readonly profileService: ProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const username = params.username;


    // Allow access if the user is trying to access their own profile
    if (username === user.username) {
      return true;
    }

    // Fetch profiles for the given usernames
    const userProfile: Profile = await this.profileService.findByUsername(user.username);
    const blockedUserProfile: Profile = await this.profileService.findByUsername(username);

    // Check if the user is blocked by the other user
    const isBlockedByOtherUser = await this.blockService.findOne({
      userId: blockedUserProfile.user,
      blockedUserId: userProfile.user,
    });

    if (isBlockedByOtherUser) {
      throw new ForbiddenException('Access to this user is blocked.');
    }

    // Check if the other user is blocked by the current user
    const isBlockedByCurrentUser = await this.blockService.findOne({
      userId: userProfile.user,
      blockedUserId: blockedUserProfile.user,
    });

    if (isBlockedByCurrentUser) {
      throw new ForbiddenException('This user has blocked you.');
    }

    return true;
  }
}
