import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { UtilityService } from "../../services/utility.service";
import { BillService } from "../../services/bill/bill.service";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-bill-management",
  templateUrl: "./bill-management.component.html",
  styleUrls: ["./bill-management.component.scss"],
})
export class BillManagementComponent {
  isSubmitted: boolean = false;
  file: File | null = null;
  showImage: string | ArrayBuffer | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  pdfName: any = '';
  uploadData: any;
  initialValues: any;
  billList: any = [];
  currentPage: number = 1;
  limit: number = 5;
  totalRecords: number = 0;
  searchString: any;
  numberOfPage: number = 1;
  pages: any = [1];
  isEdit: boolean = false;
  deleteBillId: any;
  billDetails: any;
  accountType = localStorage.getItem("tiAccountType");
  isImageEdit = false

  public addBillForm: FormGroup = this.fb.group({
    vBillNo: ["", [Validators.required, Validators.maxLength(50)]],
    vVendorDetails: [
      "",
      [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(35)],
    ],
    vBillImage: ["", [Validators.required]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private billService: BillService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.initialValues = this.addBillForm.value;
    this.getAllBillData();
  }
  getAllBillData() {
    this.utilityService.showLoading();
    const param = {
      page: this.currentPage,
      limit: this.limit,
    };
    this.billService.getAllBillList(param).then((res: any) => {
      if (res.code === 200) {
        this.billList = res.data.paginatedBill;
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

  onSetLimits(event: any) {
    this.limit = event.target.value;
    this.currentPage = 1;
    this.getAllBillData();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllBillData();
    }
  }

  nextPage(): void {
    if (this.currentPage != this.numberOfPage) {
      if (this.currentPage < this.totalRecords) {
        this.currentPage++;
        this.getAllBillData();
      }
    }
  }

  onSelectPage(page: any) {
    this.currentPage = page;
    this.getAllBillData();
  }

  downloadBill(imgURL: string) {
    const fileName = imgURL.substring(imgURL.lastIndexOf("/") + 1);
    this.http.get(imgURL, { responseType: "blob" }).subscribe((blob: Blob) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }

  handleFileSelect(event: any) {
    this.showImage = '';
    this.pdfUrl = '';
    if ( event.target.files[0]?.type == "image/png" || event.target.files[0]?.type == "image/jpeg" || event.target.files[0]?.type == "image/jpg" || event.target.files[0]?.type == "application/pdf") {
      this.file = event.target.files[0];
      this.uploadData = event.target.files[0];
      this.pdfUrl = event.target.files[0]?.type == "application/pdf" ? this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.uploadData)) : '';
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.showImage = event.target.result;
      };
      reader.readAsDataURL(this.file as Blob);
      if(this.isEdit){
        this.isImageEdit = true
      }
    } else {
      this.utilityService.showErrorToast(
        "Uploaded file is not a valid image. Only JPG, PNG, JPEG & PDF allowed!"
      );
      this.uploadData = null;
      this.showImage = null;
      this.isImageEdit = false;
      return;
    }
  }

  onAddBill() {
    this.isSubmitted = true;    
    if (!this.addBillForm.valid) {
      return;
    }
    this.utilityService.showLoading();
    const formData = new FormData();
    formData.append("vBillNo", (this.addBillForm.value.vBillNo).trim());
    formData.append("vVendorDetails", (this.addBillForm.value.vVendorDetails).trim());
    formData.append("vBillImage", this.uploadData);
    this.billService.addBill(formData).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.getAllBillData();
      } else {
        this.utilityService.showErrorToast(res.message);
      }
      this.onClickDiscard();
    });
    this.utilityService.hideLoading();
  }

  onClickDiscard() {
    this.isEdit = false
    this.isSubmitted = false;
    this.addBillForm.reset(this.initialValues);
    this.uploadData = null;
    this.showImage = null;
    this.isImageEdit = false;
  }

  deleteBillDetails(item: any) {
    this.isEdit = false;
    this.deleteBillId = item.iBillId;
  }

  deleteBill() {
    this.utilityService.showLoading();
    this.billService.deleteBill(this.deleteBillId).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.getAllBillData();
      } else {
        this.utilityService.showErrorToast(res.message);
      }
    });
    this.utilityService.hideLoading();
  }

  onClickEdit(editBillId: any) {
    this.utilityService.showLoading();
    this.pdfUrl = '';
    this.pdfName = '';
    this.isEdit = true;
    this.billService.getBillDetailsById(editBillId).then((res: any) => {
      if (res.code === 200) {
        this.billDetails = res.data;
        const urlParts = res.data.vBillImage.split("/");
        const lastPart = urlParts[urlParts.length - 1];
        const pdfFlag = lastPart.toLowerCase().endsWith(".pdf");
        this.showImage = res.data.vBillImage ;
        this.pdfUrl = pdfFlag ? res.data.vBillImage : '';
        this.pdfName = pdfFlag ? urlParts[urlParts.length - 1] : '';
        this.addBillForm.patchValue({vBillNo : this.billDetails.vBillNo,vVendorDetails: this.billDetails.vVendorDetails});
        this.uploadData = 'value';
      }
    });
    this.utilityService.hideLoading();
  }

  updateBillData() {
    this.isSubmitted = true;
    if (!this.addBillForm.controls['vBillNo'].valid || !this.addBillForm.controls['vVendorDetails'].valid || !this.uploadData) {
      return;
    }
    this.utilityService.showLoading();
    const formData = new FormData();
    formData.append("vBillNo", (this.addBillForm.value.vBillNo).trim());
    formData.append("vVendorDetails", (this.addBillForm.value.vVendorDetails).trim());
    if(this.isImageEdit){
      formData.append("vBillImage", this.uploadData);   
    }
    this.billService
      .updateBill(formData, this.billDetails.iBillId)
      .then((res: any) => {
        if (res.code === 200) {
          this.isEdit = false;
          this.utilityService.showSuccessToast(res.message);
          this.getAllBillData();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
        this.isSubmitted = false;
        this.onClickDiscard();
      });
    this.utilityService.hideLoading();
  }
}
