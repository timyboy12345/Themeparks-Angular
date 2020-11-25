import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly _messages: {
    id: string,
    header: string,
    content: string,
    totalDuration: number
    classes?: string;
  }[];

  public get messages() {
    return this._messages;
  }

  constructor() {
    this._messages = [];
  }

  public addMessage(header: string, content: string, duration: number = 2000) {
    const id = this.randomString(20);

    const i = this._messages.push({
      id: id,
      header: header,
      content: content,
      totalDuration: duration,
      classes: "opacity-0",
    });

    window.setTimeout(() => {
      this._messages[i - 1].classes = "opacity-100";
    })

    window.setTimeout(() => {
      this._messages[i - 1].classes = "opacity-0";

      window.setTimeout(() => {
        this._messages.splice(i - 1, 1);
      }, 200);
    }, duration);
  }

  private randomString(length: number, chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
}
