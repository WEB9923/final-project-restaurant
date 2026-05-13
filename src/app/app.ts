import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './components/ui/toast/toast';
import { Dialog } from './components/ui/dialog/dialog';
import { Chat } from './components/ui/chat/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Dialog, Chat],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
