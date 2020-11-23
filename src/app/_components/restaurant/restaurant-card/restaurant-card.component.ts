import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss']
})
export class RestaurantCardComponent implements OnInit {
  @Input() restaurant?: Poi;
  @Input() showOpeningTimes: boolean = true;
  @Input() showArea: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
