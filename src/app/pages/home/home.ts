import { Component } from '@angular/core';
import { Hero } from '../../components/shared/hero/hero';
import { PopularDishes } from '../../components/shared/popular-dishes/popular-dishes';
import { OurStory } from '../../components/shared/our-story/our-story';

@Component({
  selector: 'app-home',
  imports: [Hero, PopularDishes, OurStory],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
