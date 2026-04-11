import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './components/ui/toast/toast';
import { Dialog } from './components/ui/dialog/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
