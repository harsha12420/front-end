import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AdminService } from 'src/app/modules/services/admin/admin.service';
import { UtilityService } from 'src/app/modules/services/utility.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
  providers: [DatePipe]
})
export class DetailPageComponent {
  repairForm!: FormGroup;
  assignAssetFormIntialValues: any;
  isAssignSubmitted: boolean = false;
  isRepairSubmitted = false;
  inventoryHistoryList: any = [];
  historyListForReport: any = [];
  selectedFormat: any;
  formats: any = ['Download Report','pdf','csv','xlsx'];

  public assignAssetForm: FormGroup = this.fb.group({
    vFirstName: ["", [Validators.required]],
    vAssetUser: ["", [Validators.required]],
    vEmailId: ["", [Validators.required]],
    vDepartmentName: ["", [Validators.required]],
    vDesignationName: ["", [Validators.required]],
    vReportingManagerName: ["", [Validators.required]],
    startDate: ["", [Validators.required]],
    endDate: [{ value: "", disabled: true }],
    vAssignComment: ["", [Validators.required, Validators.pattern("^(?! ).*[^ ]$")]]
  });
  minDate: any;
  inventoryId: any;
  minEndDate: any;
  inventoryDetails: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private route: ActivatedRoute,

  ) {
    this.minDate = new Date();
  }

  get assignForm() {
    return this.assignAssetForm.controls;
  }

  get repairFormControl() {
    return this.repairForm.controls;
  }

  ngOnInit() {
    this.selectedFormat = this.formats[0];
    this.repairForm = new FormGroup({
      vRepairComment: new FormControl("", [Validators.required, Validators.pattern("^(?! ).*[^ ]$")]),
    });

    this.assignAssetFormIntialValues = this.assignAssetForm.value;
    this.inventoryId = this.route.snapshot.params['inventoryId'];
    this.getDetailsById();
    this.getSystemHistory();
    // this.minEndDate = new Date(this.assignAssetFormIntialValues.value.startDate)
  }

  getSystemHistory() {
    this.adminService.getInventoryHistory(this.inventoryId).then((res: any) => {
      if (res.code === 200) {
        this.historyListForReport = [];
        this.inventoryHistoryList = []
        this.inventoryHistoryList = res.data;
        for (let item of this.inventoryHistoryList) {
          const data: any = {}
          data.inventoryId = item.iInventoryId
          data.employeeId = item.UserDetail?.vEmployeeId
          data.employeeName = item.UserDetail?.vFirstName + " " + item.UserDetail?.vLastName
          data.designationName = item.UserDetail?.vDesignationName
          data.reportingManagerName = item.UserDetail?.vReportingManagerName
          data.departmentName = item.UserDetail?.vDepartmentName
          data.date = moment(new Date(item.iInventoryDate * 1000)).format('YYYY-MM-DD HH:mm')
          data.status = item.tiInventoryFlag === 0 ? "Assigned" : item.tiInventoryFlag === 1 ? "Unassigned" : item.tiInventoryFlag === 2 ? "Repair" : "Trash";
          this.historyListForReport.push(data)
        }
      }
    })
  }

  downloadHistoryReport() {
    this.getSystemHistory();
    let data: any = []
    this.historyListForReport.forEach((item: any) => {
      data.push([item.inventoryId, item.employeeId, item.employeeName, item.designationName, item.reportingManagerName, item.departmentName, item.date, item.status])
    });
    const col = ['Inventory Id','Employee Id','Employee Name', 'Designation Name','Reporting Manager Name','Department Name','Date','status']
    if ( this.selectedFormat === 'pdf' ) {
      this.utilityService.downloadPDF("Inventory History Report", col, data, "Inventory History Report")
    } else if ( this.selectedFormat === 'csv' ) {
      this.utilityService.downloadCSV("Inventory History Report", col, data, this.selectedFormat)
    } else if ( this.selectedFormat === 'xlsx' ) {
      this.utilityService.downloadCSV("Inventory History Report", col, data, this.selectedFormat)
    }
    this.historyListForReport = [];
  }

  onClickAssignAsset() {
    this.utilityService.showLoading();
    this.isAssignSubmitted = true;
    if (this.assignAssetForm.invalid) {
      return;
    }
    const data = {
      vInventoryUserId: this.assignAssetForm.value.vAssetUser,
      iInventoryId: this.inventoryDetails.iInventoryId,
      startDate: this.assignAssetForm.value.startDate,
      endDate: this.assignAssetForm.value.endDate,
      comment: this.assignAssetForm.value.vAssignComment,
      tiInventoryFlag: 1,
    };
    this.adminService
      .assignInventoryToUser(data)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getDetailsById();
          this.getSystemHistory();
        } else {
          this.assignAssetForm.reset(this.assignAssetFormIntialValues);
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  getDetailsById() {
    this.utilityService.showLoading();
    this.adminService.getAssetDetailsById(this.inventoryId).then((res: any) => {
      if (res.code === 200) {
        this.inventoryDetails = res.data;
      }
    })
    this.utilityService.hideLoading();
  }

  onBack() {
    this.router.navigateByUrl('/admin/inventory-management');
  }

  onSelectStartDate() {
    this.assignAssetForm.controls['endDate'].reset();
    setTimeout(() => {
      const startDate: Date = new Date(this.assignAssetForm.value.startDate)
      this.minEndDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
      if (this.minEndDate && this.minEndDate != undefined && this.minEndDate != 'Invalid Date') {
        this.assignAssetForm.controls['endDate'].enable()
      }
    }, 500);
  }

  searchUserDetailsById() {
    this.utilityService.showLoading();
    this.adminService
      .getUserDetailsById(this.assignAssetForm.value.vAssetUser)
      .then((res: any) => {
        if (res.code === 200) {
          this.assignAssetForm.patchValue(res.data);
          this.utilityService.showSuccessToast(res.message);
        } else {
          this.assignAssetForm.reset(this.assignAssetFormIntialValues);
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  unAssignInventory() {
    this.utilityService.showLoading();
    const data = {
      vInventoryUserId: this.inventoryDetails.UserDetail.vEmployeeId,
      iInventoryId: this.inventoryId,
    }
    this.adminService.unAssignInventory(data).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message)
        this.getDetailsById();
        this.getSystemHistory();
      }
      else {
        this.utilityService.showErrorToast(res.message)
      }
    })
    this.utilityService.hideLoading();
  }

  onClickTrash() {
    this.utilityService.showLoading();
    const data = {
      bIsTrash: "true",
    }
    this.adminService
      .updateAsset(data, this.inventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getDetailsById();
          this.getSystemHistory();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  onClickRepair() {

    this.isRepairSubmitted = true;
    if (this.repairForm.invalid) {
      return;
    }

    this.utilityService.showLoading();
    const data = {
      bIsRepair: "true",
      vRepairComment: this.repairForm.value.vRepairComment
    }
    this.adminService
      .updateAsset(data, this.inventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getDetailsById();
          this.getSystemHistory();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }
}
