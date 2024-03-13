import { Injectable } from '@angular/core';
import {  Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {

    constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) { }
    canActivate():
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this.authService.isLoggedIn()) {
            this.toastr.info('Please Log In!');
            this.router.navigate(['/login']);
            return false;
        }
        // logged in, so return true
        this.authService.isLoggedIn();
        return true;
    }
}
