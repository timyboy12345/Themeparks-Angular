import { Injectable } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private titleService: Title) { }

  public setTitle(title: string, addAppName: boolean = true) {
    this.titleService.setTitle(`${title} ${addAppName ? ' / Themeparks' : ''}`);
  }
}
