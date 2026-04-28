import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { resetPasswordSchema } from '../../schemas/reset-password-schema';
import { ResetPasswordModel } from '../../models/reset-password-model';
import { Button } from '../../components/ui/button/button';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [FormField, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  resetPasswordModel = signal<ResetPasswordModel>({
    newPassword: '',
    newPasswordConfirm: '',
  });

  queryParams = toSignal<Params>(this.route.queryParams, {
    requireSync: true,
  });

  token = computed(() => this.queryParams()['token'] ?? null);

  resetPasswordForm = form(this.resetPasswordModel, (path): void =>
    validateStandardSchema(path, resetPasswordSchema),
  );

  handleResetPassword(evt: SubmitEvent): void {
    evt.preventDefault();

    this.auth
      .resetPassword({ newPassword: this.resetPasswordModel().newPassword, token: this.token() })
      .subscribe({
        next: (): void => {
          this.router.navigate(['/auth/login'], {
            replaceUrl: true,
          });
        },
      });
  }
}
