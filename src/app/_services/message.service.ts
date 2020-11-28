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
      const newIndex = this.privateMessages.indexOf(this.privateMessages.filter(m => m.id === id)[0]);
      this.privateMessages[newIndex].classes = 'opacity-100';
    });

    window.setTimeout(() => {
      const newIndex = this.privateMessages.indexOf(this.privateMessages.filter(m => m.id === id)[0]);
      this.privateMessages[newIndex].classes = 'opacity-0';

      window.setTimeout(() => {
        const secondNewIndex = this.privateMessages.indexOf(this.privateMessages.filter(m => m.id === id)[0]);
        this.privateMessages.splice(secondNewIndex, 1);
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
