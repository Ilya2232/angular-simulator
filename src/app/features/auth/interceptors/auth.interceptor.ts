import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const addToken = (req: HttpRequest<unknown>, token: string | null) =>
  token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const isAuthUrl = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  if (isAuthUrl) {
    return next(req);
  }
  return next(addToken(req, auth.getAccessToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }
      return auth.refreshToken().pipe(
        switchMap(res => next(addToken(req, res.accessToken))),
        catchError(refreshError => {
          auth.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
