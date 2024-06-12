import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../../models/user.model';

export interface Response {
  id: string;
  name: string;
  username: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  userSub = new BehaviorSubject<User>(null);
  private API = 'https://twitter-api-ld6h.onrender.com/';

  constructor() {}

  signUp(name: string, username: string, password: string): Observable<any> {
    return this.http
      .post<User>(`${this.API}auth/register`, {
        name,
        username,
        password,
      })
      .pipe(
        tap((user) => {
          this.storingUser(
            user.name,
            user.username,
            user.password,
            user.access_token
          );
        }),
        catchError(this.handleAuthError)
      );
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http
      .post<User>(`${this.API}auth/login`, { username, password })
      .pipe(
        tap((user) => {
          this.storingUser(
            user.name,
            user.username,
            user.password,
            user.access_token
          );
        }),
        catchError(this.handleAuthError)
      );
  }

  private storingUser(
    name: string,
    username: string,
    password: string,
    access_token: string
  ) {
    const user: User = {
      name: name,
      username: username,
      password: password,
      access_token: access_token,
    };
    this.userSub.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  private handleAuthError(errorResponse: HttpErrorResponse) {
    let error = 'Wrong password';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(error);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        error = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        error = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        error =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        error =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        error = 'he password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        error = 'The user account has been disabled by an administrator.';
        break;
    }
    return throwError(error);
  }

  logOut() {
    this.userSub.next(null);
    localStorage.removeItem('user');
    // this.router.navigate(['/logout']);
  }
}
