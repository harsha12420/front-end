import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./../../../modules/services/auth/auth.service";
import {
  NAVIGATION_ROUTES,
  ROUTE_PATH,
  COOKIES_KEY,
} from "./../../../constants/constants";
import { UtilityService } from "../../services/utility.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoginSubmit = false;
  isShowPassword = false;
  cookieValue: string = "false";

  constructor(
    private router: Router,
    private authService: AuthService,
    private utility: UtilityService,
    private cookieService: CookieService
  ) {
    if (this.cookieService.check("remember_me_status")) {
      this.cookieValue = this.cookieService.get("remember_me_status");
      if (this.cookieValue == "true") {
        let tokan = localStorage.getItem("token");
        if (tokan) {
          this.router.navigate([`${NAVIGATION_ROUTES.DASHBOARD}`]);
        }
      } else {
        this.cookieService.set("remember_me_status", "false");
        localStorage.removeItem("token");
        this.router.navigate([`${ROUTE_PATH.LOGIN}`]);
      }
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      vEmailId: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]),
      txPassword: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern("^(?! ).*[^ ]$"),
      ]),
      tiAccountStatus: new FormControl(1),
      rememberMe: new FormControl(Boolean(JSON.parse(this.cookieValue))),
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  login() {
    this.isLoginSubmit = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).then((res: any) => {
      this.utility.showLoading();
      if (res.code == 200) {
        this.utility.userProfileData.next(res.data)
        localStorage.setItem("token", res.data.txAccessToken);
        localStorage.setItem("tiAccountType", res.data.tiAccountType);
        // set remember me cookie
        this.cookieService.set(
          COOKIES_KEY.REMEMBER_ME_STATUS,
          `${this.loginForm.controls["rememberMe"].value}`
        );
        this.cookieService.set(COOKIES_KEY.HEADER_TITLE, `Dashboard`);
        this.router.navigate([`${NAVIGATION_ROUTES.DASHBOARD}`]);
        this.utility.showInfoToast(res.message);
        this.utility.hideSpinner();
      } else {
        this.utility.showErrorToast(res.message);
        this.utility.hideSpinner();
      }
    });
  }
}
