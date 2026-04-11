import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideLoaderCircle } from '@lucide/angular';
import { RouterLink } from '@angular/router';
import { ILoginForm, ILoginModel } from '../../interfaces/login-form';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideLoaderCircle, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  auth = inject(AuthService);

  loginModel = signal<ILoginModel>({
    email: '',
    password: '',
  });

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

    this.auth.login(this.loginModel()).subscribe();
  }
}
