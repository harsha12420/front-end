import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ROUTE_PATH } from 'src/app/constants/constants';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: ROUTE_PATH.LOGIN, component: LoginComponent
            },
            {
                path: ROUTE_PATH.FORGOT_PASSWORD, component: ForgotPasswordComponent
            },
            {
                path: ROUTE_PATH.RESET_PASSWORD, component: ResetPasswordComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
