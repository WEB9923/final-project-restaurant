import { Component } from '@angular/core';
import { Filters } from '../../components/shared/filters/filters';

@Component({
  selector: 'app-menu',
  imports: [Filters],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {}
