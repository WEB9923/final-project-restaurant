import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getAccessToken()) {
    return true;
  }

  return toObservable(auth.currentUser).pipe(
    filter((user) => user !== null),
    take(1),
    map(() => router.createUrlTree(['/'])),
  );
};
