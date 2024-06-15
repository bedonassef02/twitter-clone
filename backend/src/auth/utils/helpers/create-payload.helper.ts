import { UserDocument } from '../../../users/entities/user.entity';
import { Payload } from '../interfaces/payload.interface';

export function createPayload(
  user: UserDocument,
  isPassed2FA: boolean = false,
): Payload {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    isTwoFactorAuthenticated: user.isTwoFactorAuthenticated,
    isPassed2FA,
  };
}
