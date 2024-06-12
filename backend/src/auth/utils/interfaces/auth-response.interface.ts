import { Payload } from './payload.interface';

export interface AuthResponse {
  user: Payload;
  access_token: string;
}
