import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleService} from '../_services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: TitleService) {
    this.titleService.setTitle('Home');
  }

  ngOnInit(): void {
  }

}
