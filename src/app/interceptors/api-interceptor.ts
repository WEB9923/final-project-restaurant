import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      setHeaders: {
        'X-API-KEY': environment.apiKey,
      },
    }),
  );
};
