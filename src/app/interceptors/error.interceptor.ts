import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 500) {
        messageService.showError('Server error')
      }
      return throwError(() => error)
    })
  );
};
