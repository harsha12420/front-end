import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AdminService } from "../../services/admin/admin.service";
import { SystemService } from "../../services/system/system.service";
import { UtilityService } from "../../services/utility.service";
import { Router } from "@angular/router";
import { trigger } from "@angular/animations";

@Component({
  animations: [trigger("", [])],
  selector: "app-system-management",
  templateUrl: "./system-management.component.html",
  styleUrls: ["./system-management.component.scss"],
})
export class SystemManagementComponent {
  form: FormGroup;
  formValues: any[] = [];
  keys: any;
  public addNewSystemForm: FormGroup = this.fb.group({
    systemName: ["", [Validators.required]],
    items: this.fb.array([]),
  });
  get items() {
    return this.addNewSystemForm.get("items") as FormArray;
  }

  assetTypes: any = [];
  inventoryList: any = [];
  inventoryId: any;
  initialValues: any;
  numberOfPage: number = 1;
  pages: any = [1];
  currentPage: number = 1;
  limit: number = 100;
  selectedFilter: any;
  totalRecords: number = 0;
  allSystemList: any = [];
  totalSystem: number = 0;
  totalAssignedSystem: number = 0;
  totalUnassignedSystem: number = 0;
  deletedSystemId: any;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  systemDetails: any;
  systemAssetsDetails: any;
  editSystemId: any;
  accountType = localStorage.getItem("tiAccountType");
  removedInventories: any = [];
  newAddedInventories: any = [];
  oldInventories: any = [];

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private systemService: SystemService,
    private utilityService: UtilityService,
    private router: Router,
    private utility: UtilityService
  ) {
    const data: any = this.router.getCurrentNavigation()?.extras.state;
    if (data) {
      this.selectedFilter = data.type == "Unassigned" ? false : true;
      // this.selectedAsset = data.assets;
    }
    this.form = new FormGroup({});
  }

  async ngOnInit() {
    await this.getAllAssetType();
    await this.getSystemList();
    this.initialValues = this.addNewSystemForm.value;
  }

  getSystemList() {
    this.utilityService.showLoading();
    const param = {
      page: this.currentPage,
      limit: this.limit,
      // searchString: this.searchString,
      hasAssetUser: this.selectedFilter,
    };
    this.systemService.getAllSystem(param).then((res: any) => {
      if (res.code === 200) {
        const list = res.data.paginatedSystem;
        let deletedItemCount = 0;
        this.allSystemList = [];
        list?.forEach((item: any) => {
          if (item.tiDeletedAt != 1) {
            this.allSystemList.push(item);
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

  getAllCounts() {
    this.systemService.getAllSystemCounts().then((res: any) => {
      if (res.code === 200) {
        this.totalSystem = res.data.totalSystem;
        this.totalAssignedSystem = res.data.totalAssignedSystem;
        this.totalUnassignedSystem = res.data.totalUnassignedSystem;
      }
    });
  }

  onSelectPage(page: any) {
    this.currentPage = page;
    this.getSystemList();
  }
  onSetLimits(event: any) {
    this.limit = event.target.value;
    this.currentPage = 1;
    this.getSystemList();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSystemList();
    }
  }

  nextPage(): void {
    if (this.currentPage != this.numberOfPage) {
      if (this.currentPage < this.totalRecords) {
        this.currentPage++;
        this.getSystemList();
      }
    }
  }

  getAllAssetType() {
    this.adminService.getAssetType().then((res: any) => {
      if (res.code === 200) {
        this.assetTypes = res.data;
        for (const asset of this.assetTypes) {
          for (const item of this.items.value) {
            if (item.assetType == asset.vAssetType) {
              asset.disabled = true;
            }
          }
        }
        if (this.systemDetails && this.systemDetails.length) {
          for (const asset of this.assetTypes) {
            for (const item of this.systemDetails) {
              if (item.vAssetName.toLowerCase() == asset.vAssetType) {
                asset.disabled = true;
              }
            }
          }
        }
      }
    });
  }

  getInventoryList(id: any) {
    this.systemService.getInventoryList(id).then((res: any) => {
      if (res.code === 200) {
        this.inventoryList = res.data;
      } else {
        this.inventoryList = [];
      }
    });
  }

  addFormControllerr(event: any, i?: any) {
    const selectedOptionName = event.target.options[event.target.selectedIndex];
    this.inventoryId = event.target.value;
    const controlName = selectedOptionName.text;
    const newController = this.fb.group({
      assetType: new FormControl(controlName, Validators.required),
      [controlName]: new FormControl(null, Validators.required),
    });
    this.getInventoryList(this.inventoryId);
    this.items.removeAt(i);
    this.items.insert(i, newController);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.addNewSystemForm.invalid) {
      return;
    }
    this.utilityService.showLoading();
    let data: any = {};
    for (let i = 0; i < this.items.value.length; i++) {
      const controllerName = this.items.value[i].assetType;
      data[this.items.value[i].assetType] = this.items.value[i][controllerName];
    }
    data.system_name = this.addNewSystemForm.value.systemName;

    this.systemService.addSystem(data).then((res: any) => {
      if (res.code === 200) {
        this.utilityService.showSuccessToast(res.message);
        this.onClickClose();
        this.getSystemList();
      } else {
        this.utilityService.showErrorToast(res.message);
        this.addNewSystemForm.reset();
        this.isSubmitted = false;
      }
    });
    this.utilityService.hideLoading();
  }

  async addExtraInformation() {
    await this.getAllAssetType();

    // const formArray = this.addNewSystemForm.get('items') as FormArray;

    // const newIndex = formArray.length;

    // for (let i = 0; i < newIndex; i++) {
    //   const control = formArray.at(i);
    //   console.log(formArray.at(i), "formArray.at(i);");

    //   control.disable();
    // }

    // const newControl = formArray.at(newIndex);
    // newControl.enable();

    this.items.push(this.newExtraInformation(""));
  }

  newExtraInformation(val: any): FormGroup {
    return this.fb.group({
      assetType: new FormControl(val, Validators.required),
      quantity: new FormControl(val, Validators.required),
    });
  }

  removeExtraInformation(i: any) {
    const removeAssetType = this.items.value[i].assetType;
    for (let i = 0; i < this.assetTypes.length; i++) {
      if (this.assetTypes[i].vAssetType == removeAssetType) {
        this.assetTypes[i].disabled = false;
      }
    }
    this.items.removeAt(i);
  }

  deleteSystemDetails(item: any) {
    this.isEdit = false;
    this.deletedSystemId = item.iSystemId;
  }

  deleteSystem() {
    this.utilityService.showLoading();
    this.systemService
      .deleteSystemById(this.deletedSystemId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.getSystemList();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.utilityService.hideLoading();
  }

  onClickDetailPage(id: any) {
    this.router.navigateByUrl(`/admin/system-management/details/${id}`);
  }

  getDetailsById(id: any) {
    this.utilityService.showLoading();
    this.systemService.getSystemDetailsById(id).then((res: any) => {
      if (res.code === 200) {
        this.editSystemId = res.data.iSystemId;
        this.systemDetails = res.data.inventories;
        let data: any = [];
        for (const item of res.data.inventories) {
          this.oldInventories.push(item.iInventoryId);
          data[item.vAssetName] = item.iInventoryId;
          this.addNewSystemForm.addControl(
            item.vAssetName,
            new FormControl("", Validators.required)
          );
          this.addNewSystemForm.controls[item.vAssetName].disable();
        }
        this.systemAssetsDetails = data;
        data["systemName"] = res.data.vSystemName;
        this.addNewSystemForm.patchValue(data);
      }
    });
    this.utilityService.hideLoading();
  }

  onClickEdit() {
    if (this.addNewSystemForm.invalid) {
      return;
    }
    this.utilityService.showLoading();
    const rowFormValue = this.addNewSystemForm.getRawValue();

    delete rowFormValue.items;
    rowFormValue.system_name = rowFormValue.systemName;
    delete rowFormValue.systemName;

    for (let i = 0; i < this.items.value.length; i++) {
      const controllerName = this.items.value[i].assetType;
      rowFormValue[this.items.value[i].assetType] =
        this.items.value[i][controllerName];
      this.newAddedInventories.push(this.items.value[i][controllerName]);
    }
    rowFormValue.removedInventories = this.removedInventories;
    rowFormValue.newAddedInventories = this.newAddedInventories;

    this.systemService
      .updateSystem(rowFormValue, this.editSystemId)
      .then((res: any) => {
        if (res.code === 200) {
          this.utilityService.showSuccessToast(res.message);
          this.onClickClose();
          this.getSystemList();
        } else {
          this.utilityService.showErrorToast(res.message);
        }
      });
    this.onClickClose();
    this.utilityService.hideLoading();
  }

  removeAlreadyAddedAsset(item: any) {
    this.removedInventories.push(item.iInventoryId);
    const rowFormValue = this.addNewSystemForm.getRawValue();
    for (let i = 0; i < this.systemDetails.length; i++) {
      if (item.vAssetName == this.systemDetails[i].vAssetName) {
        this.systemDetails.splice(i, 1);
        delete rowFormValue[item.vAssetName];
      }
    }
    this.addNewSystemForm.removeControl(item.vAssetName);
  }

  onClickClose() {
    this.isSubmitted = false;
    this.oldInventories = [];
    this.newAddedInventories = [];
    this.removedInventories = [];
    this.addNewSystemForm.reset(this.initialValues);
    this.inventoryList = [];
    this.getAllAssetType();
    this.items.controls = [];
    for (let i = 0; i < this.items.value.length; i++) {
      this.items.removeAt(i);
    }
  }
}
