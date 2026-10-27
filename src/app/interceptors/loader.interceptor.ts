import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

let activeRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);
  if (activeRequests++ === 0) loader.showLoader();

  return next(req).pipe(
    finalize(() => {
      if (--activeRequests === 0) loader.hideLoader();
    })
  );
};