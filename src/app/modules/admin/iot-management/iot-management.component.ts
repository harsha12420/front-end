import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AdminService } from "../../services/admin/admin.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from "@angular/forms";
import * as moment from "moment";
import { UtilityService } from "../../services/utility.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-iot-management",
  templateUrl: "./iot-management.component.html",
  styleUrls: ["./iot-management.component.scss"],
})
export class IotManagementComponent {
  isFileInvalidBtn = false;
  file: File | null = null;
  showImage: string | ArrayBuffer | null = null;
  isImageEdit = false
  targetParams: any;
  inventoryList: any = [];
  currentPage: number = 1;
  limit: number = 100;
  totalRecords: number = 0;
  searchString: any = '';
  numberOfPage: number = 1;
  pages: any = [1];
  inventoryDetails: any;
  deleteIotAssetId: any;
  totalIotDevice: number = 0;
  totalAssignedIotDevice: number = 0;
  totalUnassignedIotDevice: number = 0;
  modelType: any;
  initialValues: any;
  reportData: any = [];
  reportDataArray: any = [];
  selectedFormat: any;
  formats: any = ['Download Report', 'pdf', 'csv', 'xlsx'];
  filters: any = ['Select Filter', 'Assigned', 'Unassigned'];
  selectedValue: any
  newValue: any;
  fileName: any;
  isSubmitBtnDisable = false;
  public assignIOTDeviceForm: FormGroup = this.fb.group({
    vFirstName: [""],
    vAssetUser: [""],
    vEmailId: [""],
    vDepartmentName: [""],
    vDesignationName: [""],
    vReportingManagerName: [""],
    startDate: [""],
    endDate: [{ value: "", disabled: true }],
  });
  iotassetTypes: any = [];

  public addIOTDeviceForm: FormGroup = this.fb.group({
    iIotType: [null, [Validators.required]],
    vIotAssetName: [""],
    vBillNo: [""],
    vBillImage: [null],
    vProjectName: [""],
    EmployeeId: ["", [Validators.required]],
    vSerial_ModelNumber: [""],
    vBrandMaker: [""],
    iPurchaseDate: [""],
    vWarrentyPeriod: [""],
    iExpiryDate: [""],
    vComment: [""]
  });
  isEdit: boolean = false;
  isAssignSubmitted: boolean = false;
  minDate: any;
  minEndDate: any;
  minExpiryDate: any;
  assignAssetFormIntialValues: any;
  isDisabledDate: boolean = true;
  selectedAssetName: any;
  accountType = localStorage.getItem("tiAccountType");

  constructor(
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private sanitizer: DomSanitizer
  ) {
    this.minDate = new Date();
  }

  positiveNumberValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const rateValue = Number(control.value);
    if (rateValue <= 0 || isNaN(rateValue)) {
      return { positiveNumber: true };
    }
    return null;
  }

  ngOnInit() {
    this.selectedFormat = this.formats[0];
    this.assignAssetFormIntialValues = this.assignIOTDeviceForm.value;
    this.initialValues = this.addIOTDeviceForm.value;
    this.getInventoryData();
    this.getIotAssetsTypes();
  }

  get assignForm() {
    return this.assignIOTDeviceForm.controls;
  }

  resetForm() {
    this.fileName = null;
    this.showImage = null;
  }
  getAllIotInventoryCounts() {
    this.adminService.getAllIotInventoryCounts().then((res: any) => {
      if (res.code === 200) {
        this.totalIotDevice = res.data.totalIotDevice;
        this.totalAssignedIotDevice = res.data.totalAssignedIotDevice;
        this.totalUnassignedIotDevice = res.data.totalUnassignedIotDevice;
      }
    });
  }

  getInventoryData() {
    this.utilityService.showLoading();
    const param = {
      page: this.currentPage,
      limit: this.limit,
    };
    this.adminService.getIotInventory(param).then((res: any) => {

      if (res.code === 200) {
        this.reportData = [];
        this.reportData = res.data.inventory;
        const list = res.data.paginatedBill;
        let deletedItemCount = 0;
        this.inventoryList = [];
        list?.forEach((item: any) => {
          if (item.tiDeletedAt != 1) {
            this.inventoryList.push(item);
          } else {
            deletedItemCount = deletedItemCount + 1;
          }
        });

        this.totalRecords = res.data.totalCount - deletedItemCount;
        this.numberOfPage = Math.ceil(this.totalRecords / this.limit);
        if (this.totalRecords > this.limit) {
          this.pages = [];
          for (let i = 1; i <= this.numberOfPage; i++) {
            this.pages.push(i);
          }
        } else {
          this.pages = [1];
        }
        this.getAllIotInventoryCounts();
      }
    });
    this.utilityService.hideSpinner();
  }
  onSelectPage(page: any) {
    this.currentPage = page;
    this.searchString ? this.searchData() : this.getInventoryData();
  }
  onSetLimits(event: any) {
    this.limit = event.target.value;
    this.currentPage = 1;
    this.searchString ? this.searchData() : this.getInventoryData();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchString ? this.searchData() : this.getInventoryData();
    }
  }

  nextPage(): void {
    if (this.currentPage != this.numberOfPage) {
      if (this.currentPage < this.totalRecords) {
        this.currentPage++;
        this.searchString ? this.searchData() : this.getInventoryData();
      }
    }
  }

  searchData() {
    this.utilityService.showLoading();
    const param = {
      page: this.currentPage,
      limit: this.limit,
      searchString: this.searchString
    };
    this.adminService.getIotInventory(param).then((res: any) => {
      this.inventoryList = [];
      if (res.code === 200) {
        this.reportData = [];
        this.reportData = res.data.inventory;
        const list = res.data.paginatedBill;
        let deletedItemCount = 0;
        this.inventoryList = [];
        list?.forEach((item: any) => {
          if (item.tiDeletedAt != 1) {
            this.inventoryList.push(item);
          } else {
            deletedItemCount = deletedItemCount + 1;
          }
        });
        this.totalRecords = res.data.totalCount - deletedItemCount;
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
    this.utilityService.hideLoading();
  }

  viewAssetDetails(item: any) {
    this.router.navigateByUrl(`/admin/iot-management/details/${item.iIotInventoryId}`);
  }

  deleteAssetDetails(item: any) {
    this.isEdit = false;
    this.deleteIotAssetId = item.iIotInventoryId;
  }

  deleteAsset() {
    this.utilityService.showLoading();
    this.adminService.deleteIotInventoryById(this.deleteIotAssetId).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.getInventoryData();
      } else {
        this.utilityService.showErrorToast(res.message);
      }
    });
    this.utilityService.hideLoading();
  }

  searchUserDetailsById() {
    this.utilityService.showLoading();
    this.adminService
      .getUserDetailsById(this.addIOTDeviceForm.value.EmployeeId)
      .then((res: any) => {
        if (res.code === 200) {
          this.addIOTDeviceForm.patchValue(res.data);
          this.isSubmitBtnDisable = false
        } else {
          this.utilityService.showErrorToast(res.message);
          this.isSubmitBtnDisable = true;
        }
      });
    this.utilityService.hideLoading();
  }

  getIotAssetsTypes() {
    this.adminService.getIotAssetsTypes().then((res: any) => {
      if (res.code === 200) {
        this.iotassetTypes = res.data;
      }
    });
  }

  onSelectionChange() {
    if (this.selectedValue === 'addNew') {
      this.newValue = ''; // Clear the input field
    }
  }

  onAddAssetClick() {
    this.utilityService.showLoading();
    this.addIOTDeviceForm.value.iIotType = +this.addIOTDeviceForm.value.iIotType;
    if (this.addIOTDeviceForm.value.iPurchaseDate !== '') {
      this.addIOTDeviceForm.value.iPurchaseDate =
        moment(this.addIOTDeviceForm.value.iPurchaseDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }
    if (this.addIOTDeviceForm.value.iExpiryDate !== '') {
      this.addIOTDeviceForm.value.iExpiryDate =
        moment(this.addIOTDeviceForm.value.iExpiryDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    const formData = new FormData();
    formData.append('vBillImage', this.fileName);
    formData.append('iIotType', this.addIOTDeviceForm.value.iIotType);
    formData.append('vIotAssetName', this.addIOTDeviceForm.value.vIotAssetName);
    formData.append('vBillNo', this.addIOTDeviceForm.value.vBillNo);
    formData.append('vProjectName', this.addIOTDeviceForm.value.vProjectName);
    formData.append('EmployeeId', this.addIOTDeviceForm.value.EmployeeId);
    formData.append('vSerial_ModelNumber', this.addIOTDeviceForm.value.vSerial_ModelNumber);
    formData.append('vBrandMaker', this.addIOTDeviceForm.value.vBrandMaker);
    formData.append('iPurchaseDate', this.addIOTDeviceForm.value.iPurchaseDate);
    formData.append('vWarrentyPeriod', this.addIOTDeviceForm.value.vWarrentyPeriod);
    formData.append('iExpiryDate', this.addIOTDeviceForm.value.iExpiryDate);
    formData.append('vComment', this.addIOTDeviceForm.value.vComment);
    this.adminService
      .addIotInventory(formData).then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getInventoryData();
          this.addIOTDeviceForm.reset(this.initialValues);
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  updateAsset() {
    this.utilityService.showLoading();
    if (this.addIOTDeviceForm.value.iPurchaseDate !== '') {
      this.addIOTDeviceForm.value.iPurchaseDate =
        moment(this.addIOTDeviceForm.value.iPurchaseDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }
    if (this.addIOTDeviceForm.value.iExpiryDate !== '') {
      this.addIOTDeviceForm.value.iExpiryDate =
        moment(this.addIOTDeviceForm.value.iExpiryDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    }

    const formData = new FormData();
    if (this.isImageEdit) {
      formData.append('vBillImage', this.fileName);
    }
    formData.append('iIotType', this.addIOTDeviceForm.value.iIotType);
    formData.append('vIotAssetName', this.addIOTDeviceForm.value.vIotAssetName);
    formData.append('vBillNo', this.addIOTDeviceForm.value.vBillNo);
    formData.append('vProjectName', this.addIOTDeviceForm.value.vProjectName);
    formData.append('EmployeeId', this.addIOTDeviceForm.value.EmployeeId);
    formData.append('vSerial_ModelNumber', this.addIOTDeviceForm.value.vSerial_ModelNumber);
    formData.append('vBrandMaker', this.addIOTDeviceForm.value.vBrandMaker);
    formData.append('iPurchaseDate', this.addIOTDeviceForm.value.iPurchaseDate);
    formData.append('vWarrentyPeriod', this.addIOTDeviceForm.value.vWarrentyPeriod);
    formData.append('iExpiryDate', this.addIOTDeviceForm.value.iExpiryDate);
    formData.append('vComment', this.addIOTDeviceForm.value.vComment);
    this.adminService
      .updateIotInventoryById(formData, this.inventoryDetails.iIotInventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.isEdit = false;
          this.utilityService.showSuccessToast(res.message);
          this.getInventoryData();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  addNewAsset() {
    this.modelType = false;
    this.isEdit = false;
    this.addIOTDeviceForm.reset(this.initialValues);
  }

  onClickEditAsset(item: any) {
    this.utilityService.showLoading();
    this.isEdit = true;
    this.adminService
      .getIotInventoryById(item.iIotInventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.inventoryDetails = res.data;
          this.showImage = res.data.vBillImage;
          this.inventoryDetails.iPurchaseDate = this.inventoryDetails.iPurchaseDate === "0000-00-00" ?
            '' : moment(this.inventoryDetails.iPurchaseDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
          this.inventoryDetails.iExpiryDate = this.inventoryDetails.iExpiryDate === "0000-00-00" ?
            '' : moment(this.inventoryDetails.iExpiryDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
          this.addIOTDeviceForm.patchValue({
            iIotType: this.inventoryDetails.iIotType, vIotAssetName: this.inventoryDetails.vIotAssetName,
            vBillNo: this.inventoryDetails.vBillNo, vProjectName: this.inventoryDetails.vProjectName,
            EmployeeId: this.inventoryDetails.vEmployeeId, vSerial_ModelNumber: this.inventoryDetails.vSerial_ModelNumber,
            vBrandMaker: this.inventoryDetails.vBrandMaker, iPurchaseDate: this.inventoryDetails.iPurchaseDate,
            vWarrentyPeriod: this.inventoryDetails.vWarrentyPeriod, iExpiryDate: this.inventoryDetails.iExpiryDate,
            vComment: this.inventoryDetails.vComment
          });
          this.fileName = 'value';
        }
      });
    this.utilityService.hideLoading();
  }

  onClickAssignAsset() {
    this.utilityService.showLoading();
    this.isAssignSubmitted = true;
    if (this.assignIOTDeviceForm.invalid) {
      return;
    }
    const data = {
      vAssetUser: this.assignIOTDeviceForm.value.vAssetUser,
    };
    this.adminService
      .updateIotInventoryById(data, this.inventoryDetails.iIotInventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getInventoryData();
        } else {
          this.assignIOTDeviceForm.reset(this.assignAssetFormIntialValues);
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  onSelectStartDate() {
    this.assignIOTDeviceForm.controls["endDate"].reset();
    setTimeout(() => {
      this.minEndDate = new Date(this.assignIOTDeviceForm.value.startDate);
      if (
        this.minEndDate &&
        this.minEndDate != undefined &&
        this.minEndDate != "Invalid Date"
      ) {
        this.assignIOTDeviceForm.controls["endDate"].enable();
      }
    }, 500);
  }

  onClickNext() {
    this.assignIOTDeviceForm.reset(this.assignAssetFormIntialValues);
  }

  getSystemHistory() {
    this.reportDataArray = [];
    for (let item of this.reportData) {
      const data: any = {}
      data.iIotInventoryId = item.iIotInventoryId;
      data.vIotAssetName = item.vIotAssetName;
      data.vSerial_ModelNumber = item.vSerial_ModelNumber ? item.vSerial_ModelNumber : '-';
      data.vBillNo = item.vBillNo ? item.vBillNo : '-';
      data.vWarrentyPeriod = item.vWarrentyPeriod;
      data.iotAssetUser = item.UserDetail ? item?.UserDetail?.vFirstName + ' ' + item?.UserDetail?.vLastName : '-';
      data.departmentName = item.UserDetail ? item.UserDetail?.vDepartmentName : '-';
      data.vDesignationName = item.UserDetail ? item.UserDetail?.vDesignationName : '-';
      // data.repair = item.bIsRepair === false ? '-' : 'Repair';
      // data.trash = item.bIsTrash === false ? '-' : 'Trash';
      // data.assigned = item.vAssetUser ? 'Assigned' : 'Unassigned';
      this.reportDataArray.push(data)
    }
  }

  downloadReport() {
    this.getSystemHistory();
    let data: any = []
    this.reportDataArray.forEach((item: any) => {
      data.push([item.iIotInventoryId, item.vIotAssetName, item.vSerial_ModelNumber, item.vBillNo, item.vWarrentyPeriod, item.iotAssetUser, item.departmentName, item.vDesignationName])
    });
    if (data.length > 0) {
      const col = ['Iot Asset Id', 'Iot Asset Name', 'Serial Number', 'Bill No', 'Warrenty Period', 'Iot Asset user', 'Department Name', 'Designation']
      if (this.selectedFormat === 'pdf') {
        this.utilityService.downloadPDF("Inventory Report", col, data, "Inventory Report")
      } else if (this.selectedFormat === 'csv') {
        this.utilityService.downloadCSV("Inventory Report", col, data, this.selectedFormat)
      } else if (this.selectedFormat === 'xlsx') {
        this.utilityService.downloadCSV("Inventory Report", col, data, this.selectedFormat)
      }
    }
  }
  handleFileSelect(event: any) {
    this.showImage = '';
    if (event.target.files[0]?.type == "image/png" || event.target.files[0]?.type == "image/jpeg"
      || event.target.files[0]?.type == "image/jpg") {
      this.isSubmitBtnDisable = false;

      this.file = event.target.files[0];
      this.fileName = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.showImage = event.target.result;
      };
      reader.readAsDataURL(this.file as Blob);

      if (this.isEdit) {
        this.isImageEdit = true
      }
    } else {
      this.utilityService.showErrorToast(
        "Uploaded file is not a valid image. Only JPG, PNG, JPEG & PDF allowed!"
      );
      this.fileName = null;
      this.showImage = null;
      this.isImageEdit = false;
      this.isSubmitBtnDisable = true;
      return;
    }
  }

  createNewIot = async (value: any) => {
    const res: any = await this.adminService.addIotAsset({ vIotType: value });
    this.iotassetTypes.push(res.data);
    this.addIOTDeviceForm.patchValue({ iIotType: res.data.iIotId });
    return res.data;
  }

  onSelectPurchaseDate() {
    this.addIOTDeviceForm.controls["iExpiryDate"].reset();
    setTimeout(() => {
      this.minEndDate = new Date(this.addIOTDeviceForm.value.iPurchaseDate);
      if (
        this.minEndDate &&
        this.minEndDate != undefined &&
        this.minEndDate != "Invalid Date"
      ) {
        this.minExpiryDate = this.minEndDate;
        this.addIOTDeviceForm.controls["iExpiryDate"].enable();
      }
    }, 500);
  }
}