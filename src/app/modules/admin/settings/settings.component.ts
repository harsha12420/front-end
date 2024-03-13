import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Validation from 'src/app/utils/validation';
import { AdminService } from '../../services/admin/admin.service';
import { UtilityService } from '../../services/utility.service';
import { ROUTE_PATH } from 'src/app/constants/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isShowPassword = false;
  isShowNewPassword = false;
  isShowConfirmPassword = false;
  isSubmit = false;
  changePasswordForm: FormGroup | any
  initialValues: any;
  userProfileDetails: any;
  file: File | null = null;
  showImage: string | ArrayBuffer | null = null;
  uploadData: any;
  public profileDetailsForm: FormGroup = this.fb.group({
    vFirstName: ['', [Validators.required]],
    vLastName: ['', [Validators.required]],
  });
  public userDetailsForm: FormGroup = this.fb.group({
    vEmailId: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    vPhoneNo: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]]
  });
  constructor(
    private router: Router,
    private adminService: AdminService,
    public utility: UtilityService,
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?! ).*[^ ]$")]),
      newPassword: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern("^(?! ).*[^ ]$")]),
      confirmPassword: new FormControl("", [Validators.required])
    },
      {
        validators: [Validation.match("newPassword", "confirmPassword")],
      });
    this.initialValues = this.changePasswordForm.value;
    this.getUserDetails();
  }

  get profileDetailsFormControl() {
    return this.profileDetailsForm.controls;
  }

  get userDetailsFormControl() {
    return this.userDetailsForm.controls;
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  onCLickChangePassword() {
    this.isSubmit = true;
    if (!this.changePasswordForm.valid) {
      return
    }
    this.utilityService.showLoading();
    if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.confirmPassword) {
      this.adminService.changePassword(this.changePasswordForm.value).then((res: any) => {
        if (res.code === 200) {
          this.utility.showSuccessToast(res.message)
          this.router.navigate([`${ROUTE_PATH.LOGIN}`])
        } else {
          this.utility.showErrorToast(res.message)
        }
        this.isSubmit = false;
        this.changePasswordForm.reset(this.initialValues)
      })
    }
    this.utilityService.hideLoading();
  }

  getUserDetails() {
    this.utilityService.showLoading();
    this.adminService.getUserProfile().then((res: any) => {
      if (res.code === 200) {
        this.userProfileDetails = res.data
        this.profileDetailsForm.patchValue(this.userProfileDetails)
        this.userDetailsForm.patchValue(this.userProfileDetails)
        this.utilityService.userProfileData.next(res.data)
      }
    })
    this.utilityService.hideLoading();
  }

  handleFileSelect(event: any) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg" ||
      event.target.files[0].type == "image/jpg"
    ) {
      this.file = event.target.files[0];
      this.uploadData = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.showImage = event.target.result;
      };
      reader.readAsDataURL(this.file as Blob);

    } else {
      this.utilityService.showErrorToast(
        "Uploaded file is not a valid image. Only JPG, PNG & JPEG allowed!"
      );
      this.uploadData = '';
      this.showImage = '';
      return;
    }
  }

  onCloseEditProfile() {
    this.uploadData = '';
    this.getUserDetails();
    this.showImage = '';
  }

  onEditProfileDetails() {
    if (this.profileDetailsForm) {
      this.utilityService.showLoading();
      const formData = new FormData();
      formData.append('vFirstName', this.profileDetailsForm.value.vFirstName);
      formData.append('vLastName', this.profileDetailsForm.value.vLastName);
      if (this.uploadData) {
        formData.append('vImageUrl', this.uploadData);
      }
      this.adminService.updateUserProfile(formData).then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message)
          this.getUserDetails();
        }
        else {
          this.utilityService.showErrorToast(res.message)
        }
        this.utilityService.hideLoading();
      })
    }
  }

  onEditUserDetails() {
    if (this.userDetailsForm.valid) {
      this.utilityService.showLoading();
      const formData = new FormData();
      formData.append('vEmailId', this.userDetailsForm.value.vEmailId);
      formData.append('vPhoneNo', this.userDetailsForm.value.vPhoneNo);
      this.adminService.updateUserProfile(formData).then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message)
          this.getUserDetails();
        }
        else {
          this.utilityService.showErrorToast(res.message)
        }
        this.utilityService.hideLoading();
      })
    }
  }
}
