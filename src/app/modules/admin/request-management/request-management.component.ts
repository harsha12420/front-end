import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { RequestService } from "../../services/request/request.service";
import { Router } from "@angular/router";
import { UtilityService } from "../../services/utility.service";

@Component({
  selector: "app-request-management",
  templateUrl: "./request-management.component.html",
  styleUrls: ["./request-management.component.scss"],
})
export class RequestManagementComponent {
  addRequestForm!: FormGroup;
  isAddRequestSubmit = false;
  assetTypes: any = [];
  requestList: any = [];
  showRequestsflag = 0;
  currentPage: number = 1;
  limit: number = 5;
  totalRecords: number = 0;
  numberOfPage: number = 1;
  pages: any = [1];
  accountType = localStorage.getItem("tiAccountType");
  initialValues = null
  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private utilityService: UtilityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.addRequestForm = new FormGroup({
      iDeviceType: new FormControl("", [Validators.required]),
      vDeviceInfo: new FormControl("", [Validators.required, Validators.pattern(/.*\S.*/)]),
    });
    this.initialValues = this.addRequestForm.value;
    this.getAllAssetType();
    this.changeTabforRequest(0);
  }

  get addRequestFormControl() {
    return this.addRequestForm.controls;
  }

  onSelectPage(page: any) {
    this.currentPage = page;
    this.changeTabforRequest(this.showRequestsflag);
  }

  onSetLimits(event: any) {
    this.limit = event.target.value;
    this.currentPage = 1;
    this.changeTabforRequest(this.showRequestsflag);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changeTabforRequest(this.showRequestsflag);
    }
  }

  nextPage(): void {
    if (this.currentPage != this.numberOfPage) {
      if (this.currentPage < this.totalRecords) {
        this.currentPage++;
        this.changeTabforRequest(this.showRequestsflag);
      }
    }
  }

  getAllAssetType() {
    this.requestService.getAssetType().then((res: any) => {
      if (res.code === 200) {
        this.assetTypes = res.data;
      }
    });
  }

  onClickDetailPage(id: any) {
    this.router.navigateByUrl(`/admin/request-management/details/${id}`);
  }

  changeTabforRequest(flag: any) {
    this.utilityService.showLoading();
    this.showRequestsflag = flag;
    let params = { flag: flag, limit: this.limit, page: this.currentPage };
    this.requestService.getRequests(params).then((res: any) => {
      if (res.code === 200) {
        this.requestList = res.data.request;
        this.totalRecords = res.data.totalCount;
        this.numberOfPage = Math.ceil(this.totalRecords / this.limit);
        if (this.totalRecords > this.limit) {
          this.pages = [];
          for (let i = 1; i <= this.numberOfPage; i++) {
            this.pages.push(i);
          }
        } else {
          this.pages = [1];
        }
      }
    });

    this.utilityService.hideSpinner();
  }

  addRequest() {
    this.utilityService.showLoading();
    this.isAddRequestSubmit = true;
    if (this.addRequestForm.invalid) {
      return;
    }

    this.requestService
      .addRequest(this.addRequestForm.value)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.changeTabforRequest(this.showRequestsflag);
          this.utilityService.hideLoading();
          this.addRequestForm.reset(this.initialValues)
          this.isAddRequestSubmit = false;
        }
      });
  }

  onModalClose() {
    this.addRequestForm.reset(this.initialValues)
    this.isAddRequestSubmit = false;
  }
}
