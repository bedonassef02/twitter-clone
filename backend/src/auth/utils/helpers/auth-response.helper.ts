import { Payload } from '../interfaces/payload.interface';
import { AuthResponse } from '../../dto/responses/auth.response';

export function authResponse(payload: Payload, token: string): AuthResponse {
  return {
    id: payload.id,
    name: payload.name,
    username: payload.username,
    access_token: token,
    isTwoFactorAuthenticated: payload.isTwoFactorAuthenticated,
    isPassed2FA: payload.isPassed2FA,
  };
}
