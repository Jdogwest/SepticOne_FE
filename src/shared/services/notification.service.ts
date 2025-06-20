import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error';

export interface Notification {
  text: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _messages = signal<Notification[]>([]);

  messages() {
    return this._messages;
  }

  show(text: string, type: NotificationType = 'success') {
    this._messages.update((msgs) => [...msgs, { text, type }]);
    setTimeout(() => {
      this._messages.update((msgs) => msgs.slice(1));
    }, 5000);
  }

  success(text: string) {
    this.show(text, 'success');
  }

  error(text: string) {
    this.show(text, 'error');
  }
}
