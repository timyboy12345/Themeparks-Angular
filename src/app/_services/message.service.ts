import {Injectable} from '@angular/core';
import {Message} from '../_interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly privateMessages: Message[];

  public get messages(): Message[] {
    return this.privateMessages;
  }

  constructor() {
    this.privateMessages = [];
  }

  public addMessage(header: string, content: string, duration: number = 2000): void {
    const id = this.randomString(20);

    const i = this.privateMessages.push({
      id,
      header,
      content,
      totalDuration: duration,
      classes: 'opacity-0',
    });

    window.setTimeout(() => {
      this.privateMessages[i - 1].classes = 'opacity-100';
    });

    window.setTimeout(() => {
      this.privateMessages[i - 1].classes = 'opacity-0';

      window.setTimeout(() => {
        this.privateMessages.splice(i - 1, 1);
      }, 200);
    }, duration);
  }

  private randomString(length: number, chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}
