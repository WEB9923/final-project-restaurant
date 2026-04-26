import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideChevronDown,
  LucideLogOut,
  LucideMenu,
  LucideShoppingCart,
  LucideUser,
} from '@lucide/angular';
import gsap from 'gsap';
import { NgClass } from '@angular/common';
import { NAV_LINKS } from '../../../lib/constants';
import { AuthService } from '../../../services/auth-service';
import { Separator } from '../../ui/separator/separator';
import { CategoriesService } from '../../../services/categories-service';
import { CartService } from '../../../services/cart-service';
import { Button } from '../../ui/button/button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    LucideChevronDown,
    NgClass,
    RouterLinkActive,
    Separator,
    LucideUser,
    LucideLogOut,
    LucideShoppingCart,
    LucideMenu,
    Button,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, AfterViewInit {
  categoriesService = inject(CategoriesService);
  auth = inject(AuthService);
  cart = inject(CartService);

  activeRoute = inject(ActivatedRoute);

  navLinks = NAV_LINKS;
  isDropdownOpened: boolean = false;
  isUserDropdownOpened: boolean = false;
  isMobileMenuOpened: boolean = false;
  isMobileCategoriesDropdownOpened: boolean = false;

  queryParams = toSignal(this.activeRoute.queryParamMap);

  activatedCategoryId = computed((): number | null => {
    const id = this.queryParams()?.get('categoryId');

    return id ? Number(id) : null;
  });

  dropdown = viewChild.required<ElementRef<HTMLElement>>('dropdown');
  navItems = viewChildren<ElementRef<HTMLElement>>('navItem');
  userDropdown = viewChild.required<ElementRef<HTMLElement>>('userDropdown');
  mobileMenu = viewChild.required<ElementRef<HTMLElement>>('mobileMenu');
  mobileDropdown = viewChild.required<ElementRef<HTMLElement>>('mobileDropdown');
  mobileMenuItems = viewChildren<ElementRef<HTMLElement>>('mobileMenuItem');

  toggleMobileMenu(): void {
    if (this.isMobileMenuOpened) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  toggleMobileCategoriesDropdown(): void {
    if (this.isMobileCategoriesDropdownOpened) {
      this.hideMobileCategoriesDropdown();
    } else {
      this.showMobileCategoriesDropdown();
    }
  }

  showMobileCategoriesDropdown(): void {
    this.isMobileCategoriesDropdownOpened = true;

    gsap.to(this.mobileDropdown().nativeElement, {
      height: 'auto',
      autoAlpha: 1,
      duration: 0.3,
    });
  }

  hideMobileCategoriesDropdown(): void {
    this.isMobileCategoriesDropdownOpened = false;

    gsap.to(this.mobileDropdown().nativeElement, {
      height: '0',
      autoAlpha: 0,
      duration: 0.3,
    });
  }

  openMobileMenu(): void {
    this.isMobileMenuOpened = true;

    gsap.set(
      this.mobileMenuItems().map((item) => item.nativeElement),
      {
        opacity: 1,
        y: 0,
      },
    );

    const tl = gsap.timeline();

    tl.to(this.mobileMenu().nativeElement, {
      x: 0,
      duration: 0.3,
      ease: 'power3.out',
    }).from(
      this.mobileMenuItems().map((item) => item.nativeElement),
      {
        opacity: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.25,
      },
      '-=0.15',
    );
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpened = false;

    const tl = gsap.timeline();

    tl.to(
      this.mobileMenuItems().map((item) => item.nativeElement),
      {
        opacity: 0,
        y: -20,
        stagger: 0.05,
        duration: 0.2,
      },
    ).to(
      this.mobileMenu().nativeElement,
      {
        x: '-100%',
        duration: 0.3,
        ease: 'power3.in',
        onComplete: (): void => this.hideMobileCategoriesDropdown(),
      },
      '-=0.1',
    );
  }

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

    gsap.set(this.mobileMenu().nativeElement, { x: '-100%' });
  }

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe();

    this.cart.fetchCartProducts({ showLoader: false }).subscribe();
  }
}
