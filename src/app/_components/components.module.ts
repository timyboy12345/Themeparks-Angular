import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from "./card/card.component";
import { ButtonComponent } from './button/button.component';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
    exports: [
        CardComponent,
        ButtonComponent
    ]
})
export class ComponentsModule {
}
