import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { LucideBotMessageSquare, LucideX } from '@lucide/angular';
import { NgClass } from '@angular/common';
import { Button } from '../button/button';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { BotModel } from '../../../models/bot-model';
import { botSchema } from '../../../schemas/bot-schema';
import { ChatBotService } from '../../../services/chat-bot-service';
import { v4 as uuidv4 } from 'uuid';
import { gsap } from 'gsap';

@Component({
  selector: 'app-chat',
  imports: [LucideBotMessageSquare, LucideX, NgClass, Button, FormField],
  template: `
    <div class="fixed bottom-4 right-4 flex flex-col-reverse items-end z-50">
      <button
        #triggerBtn
        (click)="toggleShowMessenger()"
        (mousedown)="tapAnimate()"
        (mouseup)="releaseAnimate()"
        class="lg:w-14 lg:h-14 w-12 h-12 flex items-center justify-center cursor-pointer rounded-full border-border border-2 bg-primary text-primary-foreground"
      >
        <svg lucideBotMessageSquare></svg>
      </button>

      @if (isShowMessenger()) {
        <div
          #messenger
          class="rounded-radius flex flex-col bg-background overflow-hidden border-2 border-border md:w-100 w-full h-130"
        >
          <header class="flex items-center justify-between bg-primary px-4 py-2.5">
            <h3 class="text-lg font-semibold text-primary-foreground">ChatBot</h3>

            <button
              (click)="closeMessenger()"
              class="flex items-center justify-center w-6 h-6 rounded-radius bg-transparent hover:bg-accent/50 cursor-pointer text-primary-foreground"
            >
              <svg lucideX></svg>
            </button>
          </header>
          <div
            #scrollContainer
            class="flex flex-col gap-4 p-4 py-6 flex-1 overflow-y-auto"
          >
            @for (message of messages(); track message) {
              <div
                class="max-w-[75%] w-fit p-2 text-[16px]"
                [ngClass]="{
                  'text-left bg-secondary rounded-radius rounded-bl-none': message.role === 'bot',
                  'text-right bg-primary ml-auto text-primary-foreground rounded-radius rounded-br-none':
                    message.role === 'user',
                }"
              >
                {{ message.message }}
              </div>
            } @empty {
              <div class="flex items-center justify-center flex-col gap-2 text-center">
                <svg
                  lucideBotMessageSquare
                  [size]="50"
                ></svg>
                <p class="text-muted-foreground text-lg">Ask me anything about our menu</p>
              </div>
            }
            @if (chatbotService.isLoading()) {
              <div
                class="max-w-[75%] w-fit p-2 bg-secondary text-left rounded-radius rounded-bl-none"
              >
                <div class="flex gap-1">
                  <div class="size-3 rounded-full bg-primary animate-pulse"></div>
                  <div class="size-3 rounded-full bg-primary animate-pulse delay-75"></div>
                  <div class="size-3 rounded-full bg-primary animate-pulse delay-150"></div>
                </div>
              </div>
            }
          </div>

          <div class="border-t-2 border-border bg-background">
            @if (isLimited()) {
              <div class="flex flex-col justify-center items-center gap-2 p-3">
                <p class="text-xs text-muted-foreground font-medium">
                  Context limit reached (10/10)
                </p>

                <app-button
                  [variant]="'text'"
                  label="Reset"
                  size="sm"
                  (clicked)="resetChat()"
                />
              </div>
            } @else {
              <form
                (submit)="send($event)"
                class="flex items-center w-full h-full relative"
              >
                <textarea
                  [formField]="formModel.message"
                  (keydown.enter)="$event.preventDefault(); send()"
                  class="w-full resize-none border-none outline-none p-3 pr-14 bg-input/60"
                  placeholder="Ask anything about our menu.."
                ></textarea>
                <app-button
                  type="submit"
                  label="Send"
                  loadingText="thinking.."
                  [loading]="chatbotService.isLoading()"
                  [disabled]="formModel.message().invalid()"
                  classNames="absolute top-1/2 -translate-y-1/2 right-1"
                />
              </form>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class Chat {
  chatbotService = inject(ChatBotService);

  scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');
  messenger = viewChild<ElementRef<HTMLElement>>('messenger');
  triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  messages = signal<{ role: 'user' | 'bot'; message: string }[]>([]);

  messageModel = signal<BotModel>({ message: '' });

  isShowMessenger = signal<boolean>(false);

  sessionId = signal<string>(localStorage.getItem('chat_session_id') || this.generateNewSession());

  formModel = form(this.messageModel, (path): void => validateStandardSchema(path, botSchema));

  readonly MAX_CONTEXT = 10;

  isLimited = computed((): boolean => this.messages().length >= this.MAX_CONTEXT);

  resetChat(): void {
    const newId = uuidv4();

    localStorage.setItem('chat_session_id', newId);

    this.messages.set([]);
    this.sessionId.set(newId);
    this.messageModel.set({ message: '' });
  }

  private generateNewSession(): string {
    const newId = uuidv4();
    localStorage.setItem('chat_session_id', newId);
    return newId;
  }

  private scrollToBottom(): void {
    if (this.scrollContainer()) {
      const element = this.scrollContainer()?.nativeElement;

      element?.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  toggleShowMessenger = (): void => this.isShowMessenger.update((prev): boolean => !prev);
  closeMessenger = (): void => {
    const element = this.messenger()?.nativeElement;

    if (element) {
      gsap.to(element, {
        height: 0,
        width: 0,
        autoAlpha: 0,
        duration: 0.4,

        onComplete: (): void => this.isShowMessenger.set(false),
      });
    }
  };

  send(evt?: SubmitEvent): void {
    evt?.preventDefault();

    if (this.formModel().invalid()) {
      this.formModel.message().markAsDirty();
      return;
    }

    if (this.isLimited()) return;

    const userMessage = this.messageModel().message;

    this.messages.update((prev) => [...prev, { role: 'user', message: userMessage }]);

    this.messageModel.set({ message: '' });

    this.chatbotService
      .askAI({
        chatInput: userMessage,
        sessionId: this.sessionId(),
      })
      .subscribe({
        next: (botResponse): void => {
          console.log({ botResponse: botResponse.message });

          this.messages.update((prev) => [...prev, { role: 'bot', message: botResponse.output }]);
        },
        error: (): void => {
          this.messages.update((prev) => [
            ...prev,
            { role: 'bot', message: 'An unexpected error occurred' },
          ]);
        },
      });
  }

  tapAnimate(): void {
    const element = this.triggerBtn()?.nativeElement;

    if (element) {
      gsap.to(element, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power1.out',
      });
    }
  }

  releaseAnimate(): void {
    const element = this.triggerBtn()?.nativeElement;

    if (element) {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(3)',
      });
    }
  }

  constructor() {
    effect((): void => {
      const messages = this.messages();
      const loading = this.chatbotService.isLoading();

      localStorage.setItem('chat_history', JSON.stringify(messages));

      setTimeout((): void => {
        this.scrollToBottom();
      }, 10);
    });

    effect((): void => {
      const show = this.isShowMessenger();
      const element = this.messenger()?.nativeElement;

      if (show && element) {
        gsap.from(element, {
          autoAlpha: 0,
          width: 0,
          height: 0,
          duration: 0.4,
          transformOrigin: 'bottom right',
        });
      }
    });

    const savedHistory = localStorage.getItem('chat_history');

    if (savedHistory) {
      this.messages.set(JSON.parse(savedHistory));
    }
  }
}
