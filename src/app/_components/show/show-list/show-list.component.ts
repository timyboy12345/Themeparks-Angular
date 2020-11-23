import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
  @Input() shows?: Poi[];

  constructor() { }

  ngOnInit(): void {
  }

}
