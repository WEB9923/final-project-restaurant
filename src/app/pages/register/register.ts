import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { IRegisterForm, IRegisterModel } from '../../interfaces/register-form';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LucideCircleDot, LucideLoaderCircle } from '@lucide/angular';
import gsap from 'gsap';

@Component({
  selector: 'app-register',
  imports: [NgClass, RouterLink, FormsModule, LucideLoaderCircle, LucideCircleDot],
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
  isLoading = signal<boolean>(false);

  textBlock = viewChild.required<ElementRef<HTMLDivElement>>('textBlock');
  loaderBlock = viewChild.required<ElementRef<HTMLDivElement>>('loaderBlock');

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

  constructor() {
    effect((): void => {
      const loading = this.isLoading();
      const text = this.textBlock().nativeElement;
      const loader = this.loaderBlock().nativeElement;

      if (loading) {
        const tl = gsap.timeline();

        tl.to(text, { y: -10, opacity: 0, duration: 0.15 }).fromTo(
          loader,
          {
            y: 10,
            opacity: 0,
          },
          { y: 0, opacity: 1, duration: 0.15 },
          '-=0.2',
        );
      } else {
        const tl = gsap.timeline();

        tl.to(loader, { y: 10, opacity: 0, duration: 0.15 }).to(text, {
          y: 0,
          opacity: 1,
          duration: 0.15,
        });
      }
    });
  }

  handleRegister(evt: SubmitEvent): void {
    evt.preventDefault();
    this.isLoading.set(true);

    this.auth.register(this.registerModel()).subscribe({
      next: (): void => {
        this.isLoading.set(false);
      },
      error: (): void => {
        this.isLoading.set(false);
      },
      complete: (): void => {
        this.isLoading.set(false);
      },
    });
  }
}
