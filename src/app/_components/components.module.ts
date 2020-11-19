import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardComponent} from './card/card.component';
import { ButtonComponent } from './button/button.component';
import {RouterModule} from '@angular/router';
import { StatusIndicatorComponent } from './ride/status-indicator/status-indicator.component';

@NgModule({
  declarations: [
    CardComponent,
    ButtonComponent,
    StatusIndicatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
    exports: [
        CardComponent,
        ButtonComponent,
        StatusIndicatorComponent
    ]
})
export class ComponentsModule {
}
