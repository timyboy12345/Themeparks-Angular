import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [{
  path: 'home',
  component: HomeComponent
}, {
  path: 'parks',
  loadChildren: () => import('./themeparks/themeparks.module').then(m => m.ThemeparksModule)
}, {
  path: 'park/:park_id',
  loadChildren: () => import('./themepark/themepark.module').then(m => m.ThemeparkModule)
}, {
  pathMatch: 'full',
  path: '**',
  redirectTo: '/home'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
