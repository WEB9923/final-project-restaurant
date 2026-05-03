import { Component, inject, signal } from '@angular/core';
import { Button } from '../../components/ui/button/button';
import { ForgotPasswordModel } from '../../models/forgot-password-model';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { forgotPasswordSchema } from '../../schemas/forgot-password-schema';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { InvalidInput } from '../../directives/invalid-input';

@Component({
  selector: 'app-forgot-password',
  imports: [Button, FormField, InvalidInput],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  auth = inject(AuthService);
  router = inject(Router);

  forgotPasswordModel = signal<ForgotPasswordModel>({
    email: '',
  });

  forgotPasswordForm = form(this.forgotPasswordModel, (path): void =>
    validateStandardSchema(path, forgotPasswordSchema),
  );

  handleForgotPassword(evt: SubmitEvent): void {
    evt.preventDefault();

    if (this.forgotPasswordForm.email().invalid()) return;

    this.auth.forgotPassword({ email: this.forgotPasswordModel().email }).subscribe({
      next: ({ data }): void => {
        this.router.navigate(['/auth/reset-password'], {
          queryParams: { token: data },
        });
      },
    });
  }
}
