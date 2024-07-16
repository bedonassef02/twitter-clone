import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
} from '@angular/common/http';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const UserInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.userSub.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) {
        return next(req);
      }

      const clonedReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          `Bearer ${user.access_token}`
        ),
      });
      return next(clonedReq);
    })
  );
};
