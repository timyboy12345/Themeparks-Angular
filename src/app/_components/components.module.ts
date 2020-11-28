import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from './card/card.component';
import { ButtonComponent } from './button/button.component';
import {RouterModule} from '@angular/router';
import { StatusIndicatorComponent } from './ride/status-indicator/status-indicator.component';
import { RideListComponent } from './ride/ride-list/ride-list.component';
import { RideCardComponent } from './ride/ride-card/ride-card.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { RestaurantListComponent } from './restaurant/restaurant-list/restaurant-list.component';
import { RestaurantCardComponent } from './restaurant/restaurant-card/restaurant-card.component';
import { ShowListComponent } from './show/show-list/show-list.component';
import { ShowCardComponent } from './show/show-card/show-card.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent,
    StatusIndicatorComponent,
    RideListComponent,
    RideCardComponent,
    RestaurantListComponent,
    RestaurantCardComponent,
    ShowListComponent,
    ShowCardComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
  ],
  exports: [
    CardComponent,
    ButtonComponent,
    StatusIndicatorComponent,
    RideCardComponent,
    RideListComponent,
    RestaurantListComponent,
    RestaurantCardComponent,
    ShowListComponent,
    ShowCardComponent,
    MapComponent
  ]
})
export class ComponentsModule {
}
