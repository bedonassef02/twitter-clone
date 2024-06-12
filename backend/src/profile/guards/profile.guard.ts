import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardService } from '../../posts/services/guard.service';

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

    try {
      const userProfile = await this.guardService.getProfile(username);

      if (
        userProfile &&
        (!userProfile.isPrivate ||
          (await this.guardService.isUserFollowing(userId, userProfile.user)))
      ) {
        return true;
      }
    } catch (error) {
      // Log the error or handle it accordingly
      console.error('Error in ProfileGuard:', error);
    }

    return false;
  }
}
