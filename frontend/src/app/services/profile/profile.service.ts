import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import {
  UserInfo,
  UserActions,
  UserProfileInfo,
} from '../../models/user.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs';

export interface profileResponse {
  bio?: string;
  birthDate?: string;
  coverImage?: string;
  createdAt?: string;
  isPrivate?: boolean;
  location?: string;
  profileImage?: string;
  updatedAt?: string;
  user?: string;
  website?: string;
}
@Injectable({ providedIn: 'root' })
export class ProfileService {
  authS: AuthService = inject(AuthService);
  constructor() {}
  private API = 'https://twitter-api-ld6h.onrender.com/profile/';
  private APIEnv = environment.apiUrl + 'profile';
  http: HttpClient = inject(HttpClient);
  profileDetailsSub = new BehaviorSubject<profileResponse>(null);

  getUserName(username) {
    return this.http.get<UserInfo>(`${this.API}${username}`);
  }

  getFollowers(username: string) {
    return this.http.get<UserActions>(`${this.API}${username}/count`);
  }

  editProfile(user: UserProfileInfo) {
    return this.http
      .patch<profileResponse>(
        'https://twitter-api-ld6h.onrender.com/profile',
        user
      )
      .pipe(
        tap((response) => {
          this.profileDetailsSub.next(response);
          this.setItemTLS(response);
        })
      );
  }

  private setItemTLS(userInfo: profileResponse) {
    localStorage.setItem('profile', JSON.stringify(userInfo));
  }
}
