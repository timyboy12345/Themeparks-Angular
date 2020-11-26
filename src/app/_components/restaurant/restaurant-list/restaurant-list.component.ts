import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  @Input() restaurants: Poi[] = [];
  @Input() url: string = '{RESTAURANT_ID}';

  constructor() {
  }

  ngOnInit(): void {
  }

  public getParsedRestaurantUrl(restaurant: Poi): string {
    return this.url.replace('{RESTAURANT_ID}', restaurant.id);
  }
}
