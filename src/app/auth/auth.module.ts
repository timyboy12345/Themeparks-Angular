import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RedirectComponent} from './redirect/redirect.component';

const routes: Routes = [{
  path: 'redirect',
  component: RedirectComponent
}];

@NgModule({
  declarations: [
    RedirectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthModule {
}
