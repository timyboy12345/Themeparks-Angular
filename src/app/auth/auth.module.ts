import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {RedirectComponent} from './redirect/redirect.component';
import {UserComponent} from './user/user.component';
import {AuthGuard} from '../_guards/auth.guard';
import {ComponentsModule} from '../_components/components.module';

const routes: Routes = [{
  path: 'redirect',
  component: RedirectComponent
}, {
  path: 'user',
  component: UserComponent,
  canActivate: [AuthGuard],
}];

@NgModule({
  declarations: [
    RedirectComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  exports: [
    RouterModule
  ]
})
export class AuthModule {
}
