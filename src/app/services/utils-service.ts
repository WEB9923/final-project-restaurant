import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  truncateText({ text, length }: { text: string; length: number }): string {
    return text.length >= length ? text.slice(0, length) + '...' : text;
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
