import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let text = 'Не удалось выполнить действие. Попробуйте позже.';
      if (error.status === 0) text = 'Нет соединения с сервером.';
      else if (error.status === 404) text = 'Ресурс не найден.';
      else if (error.status >= 500) text = 'Ошибка сервера. Попробуйте позже.';
      messageService.showError(text);
      return throwError(() => error);
    }),
  );
};
