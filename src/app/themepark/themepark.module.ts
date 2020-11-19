import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RidesComponent} from './rides/rides.component';
import {HomeComponent} from './home/home.component';
import {RouterModule, Routes} from "@angular/router";
import {ComponentsModule} from "../_components/components.module";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {FormsModule} from "@angular/forms";
import { RideComponent } from './ride/ride.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'rides',
  component: RidesComponent
}, {
  path: 'rides/:ride_id',
  component: RideComponent
}]

@NgModule({
  declarations: [
    RidesComponent,
    HomeComponent,
    RideComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    LazyLoadImageModule,
    FormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ThemeparkModule {
}
