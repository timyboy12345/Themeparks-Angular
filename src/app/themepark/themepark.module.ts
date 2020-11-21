import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RidesComponent} from './rides/rides.component';
import {HomeComponent} from './home/home.component';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../_components/components.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {FormsModule} from '@angular/forms';
import { RideComponent } from './ride/ride.component';
import { ShowsComponent } from './shows/shows.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'rides',
  component: RidesComponent
}, {
  path: 'rides/:ride_id',
  component: RideComponent
}, {
  path: 'shows',
  component: ShowsComponent
}, {
  path: 'shows/:show_id',
  component: ShowComponent
}];

@NgModule({
  declarations: [
    RidesComponent,
    HomeComponent,
    RideComponent,
    ShowsComponent,
    ShowComponent
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
