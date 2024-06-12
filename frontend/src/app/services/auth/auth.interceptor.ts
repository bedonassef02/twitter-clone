import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpParams,
} from '@angular/common/http';
import { Observable, exhaustMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
  authS: AuthService = inject(AuthService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authS.userSub.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const reqColone = req.clone({
          headers: req.headers.set(
            'Authorization',
            `Bearer ${user.access_token}`
          ),
        });
        return next.handle(reqColone);
      })
    );
  }
}
