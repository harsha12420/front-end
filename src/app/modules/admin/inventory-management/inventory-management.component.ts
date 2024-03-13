import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-inventory-management",
  templateUrl: "./inventory-management.component.html",
  styleUrls: ["./inventory-management.component.scss"],
})
export class InventoryManagementComponent {
  inventoryList: any = [];
  AssetList: any = [];
  currentPage: number = 1;
  limit: number = 100;
  totalRecords: number = 0;
  searchString: any = "";
  numberOfPage: number = 1;
  pages: any = [1];
  inventoryDetails: any;
  deleteAssetId: any;
  totalAssets: number = 0;
  totalAssignedAssets: number = 0;
  totalUnassignedAssets: number = 0;
  modelType: any;
  initialValues: any;
  reportData: any = [];
  reportDataArray: any = [];
  selectedFormat: any;
  selectedFilter: any;
  selectedAsset: any;
  formats: any = ["Download Report", "pdf", "csv", "xlsx"];
  filters: any = [
    "Select Filter",
    "Select Asset",
    "Repair",
    "Trash",
    "Assigned",
    "Unassigned",
  ];

  public assignAssetForm: FormGroup = this.fb.group({
    vFirstName: ["", [Validators.required]],
    vAssetUser: ["", [Validators.required]],
    vEmailId: ["", [Validators.required]],
    vDepartmentName: ["", [Validators.required]],
    vDesignationName: ["", [Validators.required]],
    vReportingManagerName: ["", [Validators.required]],
    startDate: ["", [Validators.required]],
    endDate: [{ value: "", disabled: true }],
  });
  assetTypes: any = [];

  public addAssetForm: FormGroup = this.fb.group({
    iAssetType: ["", [Validators.required]],
    vAssetName: [
      "",
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
    ],
    vSerialNumber: [
      "",
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
    ],
    vBillNo: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]],
    dtPurchaseDate: ["", [Validators.required]],
    dtExpiryDate: ["", [Validators.required]],
    vBrandMaker: [
      "",
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)],
    ],
    vWarrentyPeriod: [
      "",
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)],
    ],
    vRate: [
      "",
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        this.positiveNumberValidator,
      ],
    ],
    vComment: [""],
  });
  isEdit: boolean = false;
  isAssignSubmitted: boolean = false;
  minDate: any;
  minEndDate: any;
  assignAssetFormIntialValues: any;
  isDisabledDate: boolean = true;
  selectedAssetName: any;
  accountType = localStorage.getItem("tiAccountType");

  constructor(
    private router: Router,
    private adminService: AdminService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    console.log(this.router.getCurrentNavigation()?.extras.state);
    const data: any = this.router.getCurrentNavigation()?.extras.state;
    if (data) {
      this.selectedFilter = data.type;
      this.selectedAsset = data.assets;
    }
  }

  onChangeAssetType(event: any) {
    this.selectedAssetName =
      event.target.options[event.target.selectedIndex].text;
    if (this.selectedAssetName == "laptop") {
      this.addAssetForm.addControl(
        "vRam",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl(
        "vStorage",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl(
        "vProcessor",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl(
        "vMotherBoard",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl(
        "vOS",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl("vLanMacAddress", new FormControl("", []));
      this.addAssetForm.addControl("vWifiMacAddress", new FormControl("", []));
    } else if (this.selectedAssetName == "ram") {
      this.addAssetForm.addControl(
        "vRam",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.removeControl("vStorage");
      this.addAssetForm.removeControl("vProcessor");
      this.addAssetForm.removeControl("vMotherBoard");
      this.addAssetForm.removeControl("vOS");
    } else if (this.selectedAssetName == "mobile") {
      this.addAssetForm.addControl(
        "vRam",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl(
        "vStorage",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.addControl("vLanMacAddress", new FormControl("", []));
      this.addAssetForm.addControl("vWifiMacAddress", new FormControl("", []));
      this.addAssetForm.removeControl("vProcessor");
      this.addAssetForm.removeControl("vMotherBoard");
      this.addAssetForm.removeControl("vOS");
    } else if (this.selectedAssetName == "ssd") {
      this.addAssetForm.addControl(
        "vStorage",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.removeControl("vProcessor");
      this.addAssetForm.removeControl("vMotherBoard");
      this.addAssetForm.removeControl("vOS");
      this.addAssetForm.removeControl("vRam");
    } else if (this.selectedAssetName == "motherboard") {
      this.addAssetForm.addControl("vLanMacAddress", new FormControl("", []));
      this.addAssetForm.addControl("vWifiMacAddress", new FormControl("", []));
    } else if (this.selectedAssetName == "processor") {
      this.addAssetForm.addControl(
        "vProcessor",
        new FormControl("", [Validators.required])
      );
      this.addAssetForm.removeControl("vStorage");
      this.addAssetForm.removeControl("vMotherBoard");
      this.addAssetForm.removeControl("vOS");
      this.addAssetForm.removeControl("vRam");
    } else {
      this.addAssetForm.removeControl("vProcessor");
      this.addAssetForm.removeControl("vStorage");
      this.addAssetForm.removeControl("vMotherBoard");
      this.addAssetForm.removeControl("vOS");
      this.addAssetForm.removeControl("vRam");
    }
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
    this.initialValues = this.addAssetForm.value;
    this.getAllAssetType();
    if (this.selectedFilter) {
      this.searchData();
    } else {
      this.assignAssetFormIntialValues = this.assignAssetForm.value;
      this.selectedFilter = this.filters[0];
      this.getInventoryData();
    }
    this.assignAssetForm.controls["startDate"].valueChanges.subscribe(() => {
      this.isDisabledDate = false;
      this.minEndDate = new Date(this.assignAssetForm.value.startDate);
    });
  }

  get assignForm() {
    return this.assignAssetForm.controls;
  }

  getAllCounts() {
    this.adminService.getAllCounts().then((res: any) => {
      if (res.code === 200) {
        this.totalAssets = res.data.totalAssets;
        this.totalAssignedAssets = res.data.totalAssignedAssets;
        this.totalUnassignedAssets = res.data.totalUnassignedAssets;
      }
    });
  }

  getInventoryData() {
    this.utilityService.showLoading();
    const param = {
      page: this.currentPage,
      limit: this.limit,
    };
    console.log("In Data===============>", param);

    this.adminService.getInventoryData(param).then((res: any) => {
      if (res.code === 200) {
        this.reportData = [];
        this.reportData = res.data.inventory;
        const list = res.data.paginatedInventory;
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
        this.getAllCounts();
      }
    });
    this.utilityService.hideSpinner();
  }

  onSelectPage(page: any) {
    this.currentPage = page;
    this.searchString || this.selectedFilter
      ? this.searchData()
      : this.getInventoryData();
  }

  onSetLimits(event: any) {
    this.limit = event.target.value;
    this.currentPage = 1;
    this.searchString || this.selectedFilter
      ? this.searchData()
      : this.getInventoryData();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchString || this.selectedFilter
        ? this.searchData()
        : this.getInventoryData();
    }
  }

  nextPage(): void {
    if (this.currentPage != this.numberOfPage) {
      if (this.currentPage < this.totalRecords) {
        this.currentPage++;
        this.searchString || this.selectedFilter
          ? this.searchData()
          : this.getInventoryData();
      }
    }
  }

  searchData() {
    this.utilityService.showLoading();
    const param: any = {
      page: this.currentPage,
      limit: this.limit,
      searchString: this.searchString,
      selectedFilter: this.selectedFilter,
    };

    if (this.selectedAsset && this.selectedAsset != "null") {
      param["iAssetType"] = this.selectedAsset;
    }
    this.adminService.getInventoryData(param).then((res: any) => {
      this.inventoryList = [];
      if (res.code === 200) {
        this.reportData = [];
        this.reportData = res.data.inventory;
        const list = res.data.paginatedInventory;
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
    // this.isEdit = false;
    // this.utilityService.showLoading();
    // this.adminService
    //   .getAssetDetailsById(item.iInventoryId)
    //   .then((res: any) => {
    //     if (res.code === 200) {
    //       this.inventoryDetails = res.data;
    //     }
    //   });
    // this.utilityService.hideLoading();

    this.router.navigateByUrl(
      `/admin/inventory-management/details/${item.iInventoryId}`
    );
  }

  deleteAssetDetails(item: any) {
    this.isEdit = false;
    this.deleteAssetId = item.iInventoryId;
  }

  deleteAsset() {
    this.utilityService.showLoading();
    this.adminService.deleteAssetById(this.deleteAssetId).then((res: any) => {
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

  getAssetName(id: any) {
    for (let i = 0; i < this.assetTypes.length; i++) {
      if (this.assetTypes[i].iAssetId === id) {
        return this.assetTypes[i].vAssetType;
      }
    }
  }

  getAllAssetType() {
    this.adminService.getAssetType().then((res: any) => {
      if (res.code === 200) {
        res.data.unshift({
          iAssetId: null,
          vAssetType: "Select Asset",
          dtCreatedAt: "2023-06-15T11:40:43.000Z",
          dtUpdatedAt: "2023-06-15T11:40:43.000Z",
          tiDeletedAt: null,
        });
        this.assetTypes = res.data;
        // console.log("Working==============", this.assetTypes[0].iAssetId);

        this.selectedAsset = this.assetTypes[0].iAssetId;
      }
    });
  }

  onAddAssetClick() {
    this.utilityService.showLoading();
    this.addAssetForm.value.iAssetType = +this.addAssetForm.value.iAssetType;
    this.addAssetForm.value.dtPurchaseDate = moment(
      this.addAssetForm.value.dtPurchaseDate
    ).format("YYYY-MM-DD");
    this.addAssetForm.value.dtExpiryDate = moment(
      this.addAssetForm.value.dtExpiryDate
    ).format("YYYY-MM-DD");
    this.adminService.addAsset(this.addAssetForm.value).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.getInventoryData();
        this.addAssetForm.reset(this.initialValues);
      } else {
        this.utilityService.showErrorToast(res.message);
      }
    });
    this.utilityService.hideLoading();
  }

  updateAsset() {
    this.utilityService.showLoading();
    this.adminService
      .updateAsset(this.addAssetForm.value, this.inventoryDetails.iInventoryId)
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
    this.addAssetForm.reset(this.initialValues);
  }

  onClickEditAsset(item: any) {
    this.utilityService.showLoading();
    this.isEdit = true;
    this.adminService
      .getAssetDetailsById(item.iInventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.inventoryDetails = res.data;

          this.addAssetForm.patchValue(this.inventoryDetails);
        }
      });
    this.utilityService.hideLoading();
  }

  onClickAssignAsset() {
    this.utilityService.showLoading();
    this.isAssignSubmitted = true;
    if (this.assignAssetForm.invalid) {
      return;
    }
    const data = {
      vAssetUser: this.assignAssetForm.value.vAssetUser,
    };
    this.adminService
      .updateAsset(data, this.inventoryDetails.iInventoryId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getInventoryData();
        } else {
          this.assignAssetForm.reset(this.assignAssetFormIntialValues);
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  onSelectStartDate() {
    this.assignAssetForm.controls["endDate"].reset();
    setTimeout(() => {
      this.minEndDate = new Date(this.assignAssetForm.value.startDate);
      if (
        this.minEndDate &&
        this.minEndDate != undefined &&
        this.minEndDate != "Invalid Date"
      ) {
        this.assignAssetForm.controls["endDate"].enable();
      }
    }, 500);
  }

  onClickNext() {
    this.assignAssetForm.reset(this.assignAssetFormIntialValues);
  }

  getSystemHistory() {
    this.reportDataArray = [];
    for (let item of this.reportData) {
      const data: any = {};
      data.assetId = item.iInventoryId;
      console.log("527------------------------------>", item);
      data.vAssetName = item.vAssetName;
      data.vSerialNumber = item.vSerialNumber ? item.vSerialNumber : "-";
      data.vBillNo = item.vBillNo ? item.vBillNo : "-";
      data.vWarrentyPeriod = item.vWarrentyPeriod;
      data.assetUser = item.UserDetail ? item.UserDetail?.full_name : "-";
      data.departmentName = item.UserDetail
        ? item.UserDetail?.vDepartmentName
        : "-";
      data.vDesignationName = item.UserDetail
        ? item.UserDetail?.vDesignationName
        : "-";
      data.repair = item.bIsRepair === false ? "-" : "Repair";
      data.trash = item.bIsTrash === false ? "-" : "Trash";
      data.assigned = item.vAssetUser ? "Assigned" : "Unassigned";
      this.reportDataArray.push(data);
    }
  }

  downloadReport() {
    this.getSystemHistory();
    let data: any = [];
    this.reportDataArray.forEach((item: any) => {
      data.push([
        item.assetId,
        item.vAssetName,
        item.vSerialNumber,
        item.vBillNo,
        item.vWarrentyPeriod,
        item.assetUser,
        item.departmentName,
        item.vDesignationName,
        item.repair,
        item.trash,
        item.assigned,
      ]);
    });
    if (data.length > 0) {
      const col = [
        "Asset Id",
        "Asset Name",
        "Serial Number",
        "Bill No",
        "Warrenty Period",
        "Asset user",
        "Department Name",
        "Designation",
        "Repair",
        "Trash",
        "Assigned",
      ];
      if (this.selectedFormat === "pdf") {
        this.utilityService.downloadPDF(
          "Inventory Report",
          col,
          data,
          "Inventory Report"
        );
      } else if (this.selectedFormat === "csv") {
        this.utilityService.downloadCSV(
          "Inventory Report",
          col,
          data,
          this.selectedFormat
        );
      } else if (this.selectedFormat === "xlsx") {
        this.utilityService.downloadCSV(
          "Inventory Report",
          col,
          data,
          this.selectedFormat
        );
      }
    }
  }
}
