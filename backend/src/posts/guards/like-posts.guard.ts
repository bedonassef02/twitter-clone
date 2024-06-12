import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardService } from '../services/guard.service';

@Injectable()
export class LikePostsGuard implements CanActivate {
  constructor(private readonly guardService: GuardService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    const postId = params.id;

    return await this.guardService.isAuth(user.id, postId);
  }
}
