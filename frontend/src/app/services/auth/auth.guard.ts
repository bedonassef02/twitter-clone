import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, map, take, tap } from 'rxjs';
import { Router, UrlTree } from '@angular/router';

export const authGuard = ():
  | Boolean
  | Promise<Boolean | UrlTree>
  | Observable<Boolean | UrlTree>
  | UrlTree => {
  const authS: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authS.userSub.pipe(
    take(1),
    map((user) => {
      const isAuth = !!user;
      if (isAuth) {
        return true;
      }
      return router.createUrlTree(['logout']);
    })
  );
};
