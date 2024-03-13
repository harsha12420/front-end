import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UtilityService } from '../../services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { ROUTE_PATH } from 'src/app/constants/constants';
import Validation from "../../../utils/validation";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  iUserId: any;
  submitted = false;
  isShowPassword = false;
  isShowConfirmPassword = false;
  constructor( private router: Router, private authService: AuthService, public utility: UtilityService, private route: ActivatedRoute  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      txPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?! ).*[^ ]$")]),
      txConfirmPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?! ).*[^ ]$")])
    },
    {
      validators: [Validation.match("txPassword", "txConfirmPassword")],
    });

    this.route.params.subscribe((params: any) => {
      const token = params['token']; 
      this.verifyEmailToken(token);
    });
  }

  get resetPasswordFormControl() {
    return this.resetPasswordForm.controls;
  }

  verifyEmailToken(token: any) {
    this.authService.checkURLToken(token).then((res:any) => {
      if ( res.code === 200 ) {
        this.iUserId = res.data.iUserId;
        this.utility.showSuccessToast("Email verified")
      } else {
        this.utility.showErrorToast(res.message)  
        this.router.navigate([`${ROUTE_PATH.LOGIN}`])
      }
    }).catch((e:any) => {
      this.utility.showErrorToast('Token not verified')
      this.router.navigate([`${ROUTE_PATH.LOGIN}`])
    })
  }

  resetPassword() {
    this.submitted = true;
    if ( this.resetPasswordForm.value.txConfirmPassword === this.resetPasswordForm.value.txPassword ) {
      this.authService.resetPassword({iUserId: this.iUserId, txPassword: this.resetPasswordForm.value.txPassword}).then((res: any) => {
        if ( res.code === 200 ) {
          this.router.navigate([`${ROUTE_PATH.LOGIN}`])
        }
      })
    } 
  }
}
