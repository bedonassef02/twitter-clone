// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpEvent,
//   HttpHandler,
//   HttpRequest,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { exhaustMap, take } from 'rxjs/operators';
// import { AuthService } from './auth.service';

// @Injectable()
// export class UserInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     return this.authService.userSub.pipe(
//       take(1),
//       exhaustMap((user) => {
//         if (!user) {
//           return next.handle(req);
//         }

//         const clonedReq = req.clone({
//           headers: req.headers.set(
//             'Authorization',
//             `Bearer ${user.access_token}`
//           ),
//         });
//         return next.handle(clonedReq);
//       })
//     );
//   }
// }

// ////////////////////////////////////////////////////////////
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
