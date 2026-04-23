import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { IRegisterForm, IRegisterModel } from '../../interfaces/register-form';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { PasswordPrerequisite } from '../../components/ui/password-prerequisite/password-prerequisite';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { registerSchema } from '../../schemas/register-schema';
import { Button } from '../../components/ui/button/button';

@Component({
  selector: 'app-register',
  imports: [NgClass, RouterLink, FormsModule, PasswordPrerequisite, FormField, Button],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  auth = inject(AuthService);

  registerModel = signal<IRegisterModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (path): void =>
    validateStandardSchema(path, registerSchema),
  );

  registerFormItems: (IRegisterForm & { name: keyof IRegisterModel })[] = [
    {
      type: 'text',
      placeholder: 'John',
      label: 'Name',
      name: 'firstName',
      isPassword: false,
      gridCols: 1,
    },
    {
      type: 'text',
      placeholder: 'Doe',
      label: 'Last Name',
      name: 'lastName',
      isPassword: false,
      gridCols: 1,
    },
    {
      type: 'email',
      placeholder: 'your-email@gmail.com',
      label: 'Email',
      name: 'email',
      isPassword: false,
      gridCols: 2,
    },
    {
      type: 'password',
      placeholder: '••••••••••',
      label: 'Password',
      name: 'password',
      isPassword: true,
      showPassword: false,
      gridCols: 2,
    },
  ];

  handleRegister(evt: SubmitEvent): void {
    evt.preventDefault();

    if (this.registerForm().invalid()) return;

    // console.log(this.registerForm().value());

    this.auth.register(this.registerModel()).subscribe();
  }
}
