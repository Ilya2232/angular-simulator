import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const start = Date.now();
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - start;
          console.log(req.method, req.url, event.status, duration + 'ms')
        }
      },
      error: (error) => {
        const duration = Date.now() - start;
        console.error(req.method, req.url, error.status, duration + 'ms');
      }
    })
  );
};
