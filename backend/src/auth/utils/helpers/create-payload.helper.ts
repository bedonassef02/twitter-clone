import { UserDocument } from '../../../users/entities/user.entity';
import { Payload } from '../interfaces/payload.interface';

export function createPayload(user: UserDocument): Payload {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
  };
}
