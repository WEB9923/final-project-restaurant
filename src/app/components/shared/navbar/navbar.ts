import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideChevronDown, LucideLogOut, LucideSettings, LucideUser } from '@lucide/angular';
import gsap from 'gsap';
import { NgClass } from '@angular/common';
import { CategoriesModel } from '../../../models/categories-model';
import { NAV_LINKS } from '../../../lib/constants';
import { HttpService } from '../../../services/http-service';
import { AuthService } from '../../../services/auth-service';
import { Separator } from '../../ui/separator/separator';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    LucideChevronDown,
    NgClass,
    RouterLinkActive,
    Separator,
    LucideSettings,
    LucideUser,
    LucideLogOut,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, AfterViewInit {
  http = inject(HttpService);
  auth = inject(AuthService);

  navLinks = NAV_LINKS;
  isDropdownOpened: boolean = false;
  isUserDropdownOpened: boolean = false;

  dropdown = viewChild.required<ElementRef<HTMLElement>>('dropdown');
  navItems = viewChildren<ElementRef<HTMLElement>>('navItem');
  userDropdown = viewChild.required<ElementRef<HTMLElement>>('userDropdown');

  categories = signal<CategoriesModel[]>([]);

  openDropdown(): void {
    this.isDropdownOpened = true;

    this.openAnimation(this.dropdown().nativeElement);
  }

  closeDropdown(): void {
    this.isDropdownOpened = false;

    this.closeAnimation(this.dropdown().nativeElement);
  }

  toggleUserDropdown() {
    if (!this.isUserDropdownOpened) this.openUserDropdown();
    else this.closeUserDropdown();
  }

  openUserDropdown(): void {
    this.isUserDropdownOpened = true;

    this.openAnimation(this.userDropdown().nativeElement);
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpened = false;

    this.closeAnimation(this.userDropdown().nativeElement);
  }

  openAnimation(element: HTMLElement): void {
    gsap.to(element, {
      y: 10,
      autoAlpha: 1,
      duration: 0.25,
      ease: 'power2.in',
    });
  }

  closeAnimation(element: HTMLElement): void {
    gsap.to(element, {
      y: 20,
      autoAlpha: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  ngAfterViewInit(): void {
    gsap.timeline({ defaults: { y: -30, x: -20 } }).from(
      this.navItems().map((element) => element.nativeElement),
      {
        stagger: 0.1,
        opacity: 0,
      },
    );
  }

  ngOnInit(): void {
    this.http.getCategories<{ data: CategoriesModel[] }>().subscribe({
      next: ({ data }) => {
        this.categories.set(data);
      },
      error: (error): void => {
        console.log(error);
      },
    });
  }

  constructor() {
    effect(() => {
      console.log(this.auth.currentUser());
    });
  }
}
