import { Component } from '@angular/core';
import { Hero } from '../../components/shared/hero/hero';
import { PopularDishes } from '../../components/shared/popular-dishes/popular-dishes';

@Component({
  selector: 'app-home',
  imports: [Hero, PopularDishes],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
