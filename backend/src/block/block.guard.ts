import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { ProfileService } from '../profile/profile.service';
import { Profile } from '../profile/entities/profile.entity';
import { Block } from './entities/block.entity';

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
    if (this.isAccessingOwnProfile(user.username, username)) {
      return true;
    }

    const userProfile: Profile = await this.getUserProfile(user.username);
    const blockedUserProfile: Profile = await this.getUserProfile(username);

    await this.checkIfBlocked(userProfile, blockedUserProfile);
    await this.checkIfBlocked(blockedUserProfile, userProfile);

    return true;
  }

  private isAccessingOwnProfile(
    userUsername: string,
    targetUsername: string,
  ): boolean {
    return userUsername === targetUsername;
  }

  private async getUserProfile(username: string): Promise<Profile> {
    return this.profileService.findByUsername(username);
  }

  private async checkIfBlocked(
    userProfile: Profile,
    targetProfile: Profile,
  ): Promise<void> {
    const isBlocked: Block = await this.blockService.findOne({
      userId: targetProfile.user,
      blockedUserId: userProfile.user,
    });

    if (isBlocked) {
      throw new ForbiddenException('Access to this user is blocked.');
    }
  }
}
