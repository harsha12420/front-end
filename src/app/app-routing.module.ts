import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/services/auth/auth.guard';
import { ROUTE_PATH } from './constants/constants';

const routes: Routes = [
  {
    path: '', redirectTo: ROUTE_PATH.LOGIN, pathMatch: 'full'
  },
  {
    path: ROUTE_PATH.ABSOLUTE,
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: ROUTE_PATH.ADMIN,
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: ROUTE_PATH.LOGIN,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
