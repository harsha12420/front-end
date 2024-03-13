import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ROUTE_PATH } from 'src/app/constants/constants';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  forgotPasswordForm!: FormGroup;
  mailSendSuccessfully:boolean = false;
  submitted = false;

  constructor( private router: Router, private authService: AuthService, private uitility: UtilityService  ) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      vEmailId: new FormControl('', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });
  }

  forgotPassword(){
    this.submitted = true;
    if (this.forgotPasswordForm.valid) {
      this.mailSendSuccessfully = true
    }
  }

  get forgotPasswordFormControl() {
    return this.forgotPasswordForm.controls;
  }

  sendLink() {
    this.authService.forgotPassword(this.forgotPasswordForm.value).then((res:any) => {
      if ( res.code == 200 ) {
        this.router.navigate([`${ROUTE_PATH.LOGIN}`])
        this.uitility.showSuccessToast(res.message)
      } else {
        this.uitility.showErrorToast(res.message)
      }
    })
  } 

}
