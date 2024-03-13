import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "src/app/modules/services/admin/admin.service";
import { RequestService } from "src/app/modules/services/request/request.service";
import { UtilityService } from "src/app/modules/services/utility.service";

@Component({
  selector: "app-detail-page",
  templateUrl: "./detail-page.component.html",
  styleUrls: ["./detail-page.component.scss"],
})
export class DetailPageComponent {
  file: File | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  rejectRequestFrom!: FormGroup;
  isRejectRequestSubmit = false;
  closeRequestFrom!: FormGroup;
  isCloseRequestSubmit = false;
  iRequestId: any;
  requestDetails: any;
  vBillImageFile: any;
  billImageError: any = true;
  accountType = localStorage.getItem("tiAccountType");
  pdfName: any = '';
  

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private utilityService: UtilityService,
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.iRequestId = this.route.snapshot.params["iRequestId"];
    this.getRequestDetails();
    this.rejectRequestFrom = new FormGroup({
      txRejectReason: new FormControl("", [Validators.required]),
    });

    this.closeRequestFrom = new FormGroup({
      vBillNo: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]*$/),
      ]),
      vVendorDetails: new FormControl("", [
        Validators.required,
        Validators.pattern(/.*\S.*/),
      ]),
      billImage: new FormControl("", [Validators.required]),
    });
  }

  get rejectRequestFromControl() {
    return this.rejectRequestFrom.controls;
  }

  getRequestDetails() {
    this.utilityService.showLoading();
    this.requestService.getRequestDetails(this.iRequestId).then((res: any) => {
      if (res.code === 200) {
        this.requestDetails = res.data;
        if ( this.requestDetails?.Bill?.vBillImage ) {
          const urlParts = this.requestDetails?.Bill?.vBillImage.split("/");
          const lastPart = urlParts[urlParts.length - 1];
          const pdfFlag = lastPart.toLowerCase().endsWith(".pdf");
          this.pdfUrl = pdfFlag ? this.requestDetails?.Bill?.vBillImage : '';
          this.pdfName = pdfFlag ? urlParts[urlParts.length - 1] : '';
        }
      }
    });
    this.utilityService.hideSpinner();
  }

  // Accept Reject request
  acceptRejectRequest(flag: any) {
    this.utilityService.showLoading();
    if (!flag) {
      this.isRejectRequestSubmit = true;
      if (this.rejectRequestFrom.invalid) {
        return;
      }
    }
    let bodyJSON = {
      bIsAccept: flag,
      txRejectReason: this.rejectRequestFrom.value.txRejectReason,
    };
    this.requestService
      .acceptRejectRequest(this.iRequestId, bodyJSON)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getRequestDetails();
        }
      });
    this.utilityService.hideSpinner();
  }

  // Close Request
  get closeRequestFromControl() {
    return this.closeRequestFrom.controls;
  }

  selectedFileUrl: any;
  fileChangeEvent(event: any): void {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg" ||
      event.target.files[0].type == "image/jpg" ||
      event.target.files[0].type == "application/pdf"
    ) {
      this.vBillImageFile = event["target"]["files"][0];
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.vBillImageFile));
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;
      };
      reader.readAsDataURL(this.vBillImageFile);
    } else {
      this.utilityService.showErrorToast(
        "Uploaded file is not a valid image. Only JPG, PNG & JPEG allowed!"
      );
      return;
    }
  }

  closeRequest() {
    this.utilityService.showLoading();
    this.isCloseRequestSubmit = true;
    if (this.closeRequestFrom.invalid) {
      return;
    }

    if (
      this.vBillImageFile == undefined ||
      this.vBillImageFile == "" ||
      this.vBillImageFile == null
    ) {
      this.closeRequestFrom.controls["billImage"].setValidators([
        Validators.required,
      ]);
      this.billImageError = true;
      return;
    } else {
      this.billImageError = false;
    }

    let reqObj = {
      iRequestId: this.iRequestId,
      vBillNo: this.closeRequestFrom.value.vBillNo,
      vVendorDetails: (this.closeRequestFrom.value.vVendorDetails).trim(),
      vBillImage: this.vBillImageFile,
    };

    this.requestService.closeRequest(reqObj).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.getRequestDetails();
      }
      if (res.code === 409) {
        this.utilityService.showErrorToast(res.message);
      }
    });
    this.utilityService.hideSpinner();
  }
}
