import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideLoader } from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { ILoginForm, ILoginModel } from '../../interfaces/login-form';
import { AuthService } from '../../services/auth-service';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { loginSchema } from '../../schemas/login-schema';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, FormField, LucideLoader],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  auth = inject(AuthService);

  loginModel = signal<ILoginModel>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (path): void => validateStandardSchema(path, loginSchema));

  loginFormItems: (ILoginForm & { name: keyof ILoginModel })[] = [
    {
      type: 'email',
      placeholder: 'your-email@gmail.com',
      label: 'Email',
      name: 'email',
      isPassword: false,
    },
    {
      type: 'password',
      placeholder: '••••••••••',
      label: 'Password',
      name: 'password',
      isPassword: true,
      showPassword: false,
    },
  ];

  handleLogin(evt: SubmitEvent): void {
    evt.preventDefault();

    if (this.loginForm.email().invalid() || this.loginForm.password().invalid()) return;

    this.auth.login(this.loginModel()).subscribe();
  }
}
