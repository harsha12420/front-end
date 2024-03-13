import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/services/admin/admin.service';
import { SystemService } from 'src/app/modules/services/system/system.service';
import { UtilityService } from 'src/app/modules/services/utility.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss'],
  providers: [DatePipe]
})
export class DetailPageComponent {

  systemId: any
  systemDetails: any
  public assignSystemForm: FormGroup = this.fb.group({
    vFirstName: ['', [Validators.required]],
    vAssetUser: ['', [Validators.required]],
    vEmailId: ['', [Validators.required]],
    vDepartmentName: ['', [Validators.required]],
    vDesignationName: ['', [Validators.required]],
    vReportingManagerName: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [{ value: '', disabled: true }],
    vAssignComment: ["", [Validators.required, Validators.pattern("^(?! ).*[^ ]$")]]
  });
  assignSystemFormIntialValues: any;
  isAssignSubmitted: boolean = false
  minDate: any = new Date();
  minEndDate: any;
  systemHistoryList: any = []
  historyListForReport: any = [];
  selectedFormat: any;
  formats: any = ['Download Report','pdf','csv','xlsx'];

  constructor(
    private route: ActivatedRoute,
    private systemService: SystemService,
    private utilityService: UtilityService,
    private router: Router,
    private fb: FormBuilder,
    private adminService: AdminService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.selectedFormat = this.formats[0];
    this.assignSystemFormIntialValues = this.assignSystemForm.value
    this.systemId = this.route.snapshot.params['systemId'];
    this.minEndDate = new Date(this.assignSystemForm.value.startDate)
    this.getDetailsById();
    this.getSystemHistory();
  }

  get assignForm() { return this.assignSystemForm.controls; }


  getDetailsById() {
    this.utilityService.showLoading();
    this.systemService.getSystemDetailsById(this.systemId).then((res: any) => {
      if (res.code === 200) {
        this.systemDetails = res.data;
      }
    })
    this.utilityService.hideLoading();
  }

  onBack() {
    this.router.navigateByUrl('/admin/system-management');
  }

  searchUserDetailsById() {
    this.utilityService.showLoading();
    this.adminService.getUserDetailsById(this.assignSystemForm.value.vAssetUser).then((res: any) => {
      if (res.code === 200) {
        this.assignSystemForm.patchValue(res.data)
        this.utilityService.showSuccessToast(res.message)
      }
      else {
        this.assignSystemForm.reset(this.assignSystemFormIntialValues)
        this.utilityService.showErrorToast(res.message)
      }
    })
    this.utilityService.hideLoading();
  }

  onSelectStartDate() {
    this.assignSystemForm.controls['endDate'].reset();
    setTimeout(() => {
      const startDate: Date = new Date(this.assignSystemForm.value.startDate)
      this.minEndDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
      if (this.minEndDate && this.minEndDate != undefined && this.minEndDate != 'Invalid Date') {
        this.assignSystemForm.controls['endDate'].enable()
      }
    }, 500);
  }

  onClickAssignSystem() {
    this.utilityService.showLoading();
    this.isAssignSubmitted = true
    if (this.assignSystemForm.invalid) {
      return
    }
    const data = {
      vSystemUserId: this.assignSystemForm.value.vAssetUser,
      iSystemId: this.systemId,
      startDate: this.assignSystemForm.value['startDate'],
      endDate: this.assignSystemForm.value['endDate'],
      comment: this.assignSystemForm.value['vAssignComment'],
    }
    this.systemService.assignSystem(data).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message)
        this.onBack();
      }
      else {
        this.assignSystemForm.reset(this.assignSystemFormIntialValues)
        this.utilityService.showErrorToast(res.message)
      }
    })
    this.utilityService.hideLoading();
  }

  getSystemHistory() {
    this.systemService.getSystemHistory(this.systemId).then((res: any) => {
      if (res.code === 200) {
        this.systemHistoryList = [];
        this.systemHistoryList = res.data;
        for (let item of this.systemHistoryList) {
          const data: any = {}
          data.systemId = item.iSystemId
          data.employeeId = item.UserDetail?.vEmployeeId
          data.employeeName = item.UserDetail?.vFirstName + " " + item.UserDetail?.vLastName
          data.designationName = item.UserDetail?.vDesignationName
          data.reportingManagerName = item.UserDetail?.vReportingManagerName
          data.departmentName = item.UserDetail?.vDepartmentName
          data.date = moment(new Date(item.iSystemDate * 1000)).format('YYYY-MM-DD HH:mm')
          data.status = item.tiSystemFlag === 1 ? 'Assigned' : 'Unassigned'
          this.historyListForReport.push(data)
        }
      }
    })
  }

  downloadHistoryReport() {
    this.getSystemHistory();
    let data: any = []
    this.historyListForReport.forEach((item: any) => {
      data.push([item.systemId, item.employeeId, item.employeeName, item.designationName, item.reportingManagerName, item.departmentName, item.date, item.status])
    });
    // const col = Object.keys(this.historyListForReport[0])
    const col = ['System Id','Employee Id','Employee Name', 'Designation Name','Reporting Manager Name','Department Name','Date','status']
    if ( this.selectedFormat === 'pdf' ) {
      this.utilityService.downloadPDF("System Report", col, data, "System Report")
    } else if ( this.selectedFormat === 'csv' ) {
      this.utilityService.downloadCSV("Inventory History Report", col, data, this.selectedFormat)
    } else if ( this.selectedFormat === 'xlsx' ) {
      this.utilityService.downloadCSV("Inventory History Report", col, data, this.selectedFormat)
    }
    this.historyListForReport = []
  }


  checkUnassignDate() {
    const data = this.systemHistoryList[this.systemHistoryList.length - 1]
    const todayDate: any = this.datePipe.transform(new Date(), 'dd-MM-YYYY')
    const unassignDate: any = this.datePipe.transform(data?.iSystemDate * 1000, 'dd-MM-YYYY')
    return data && data.tiSystemFlag == 0 && unassignDate >= todayDate;
  }

  unAssignSystem() {
    this.utilityService.showLoading();
    const data = {
      vSystemUserId: this.systemDetails.UserDetail.vEmployeeId,
      iSystemId: this.systemId,
    }
    this.systemService.unAssignSystem(data).then((res: any) => {
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
}
