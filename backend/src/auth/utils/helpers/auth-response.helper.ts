import { Payload } from '../interfaces/payload.interface';
import { AuthResponse } from '../interfaces/auth-response.interface';

export function authResponse(payload: Payload, token: string): AuthResponse {
  return {
    user: payload,
    access_token: token,
  };
}
