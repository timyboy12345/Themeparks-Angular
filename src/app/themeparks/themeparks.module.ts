import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeparksComponent} from './themeparks/themeparks.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {ComponentsModule} from "../_components/components.module";

const routes: Routes = [{
  path: '',
  component: ThemeparksComponent
}]

@NgModule({
  declarations: [ThemeparksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    LazyLoadImageModule,
    ComponentsModule
  ],
  exports: [
    RouterModule
  ]
})
export class ThemeparksModule {
}
