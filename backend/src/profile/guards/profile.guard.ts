import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardService } from '../../posts/services/guard.service';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private readonly guardService: GuardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    const { username } = params;
    const { id: userId, username: loggedInUsername } = user;

    if (loggedInUsername === username) {
      return true;
    }

    const userProfile: Profile = await this.guardService.getProfile(username);

    return (
      userProfile &&
      (!userProfile.isPrivate ||
        (await this.guardService.isUserFollowing(userId, userProfile.user)))
    );
  }
}
