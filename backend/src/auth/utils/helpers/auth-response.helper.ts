import { Payload } from '../interfaces/payload.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

export function authResponse(payload: Payload, token: string): AuthResponse {
  return {
    id: payload.id,
    name: payload.name,
    username: payload.username,
    access_token: token,
  };
}
