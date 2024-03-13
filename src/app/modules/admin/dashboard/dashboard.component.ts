import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AdminService } from "../../services/admin/admin.service";
import { NgxSpinnerService } from "ngx-spinner";
import { UtilityService } from "../../services/utility.service";
import { NAVIGATION_ROUTES, ROUTE_PATH } from "src/app/constants/constants";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  dashboardAssetsCount: any;
  //  Add router in constructor
  constructor(
    private router: Router,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private utility: UtilityService
  ) {}
  ngOnInit(): void {
    this.dashboardCount();
  }

  dashboardCount() {
    this.utility.showLoading();
    this.adminService.dashboardCount().then((res: any) => {
      if (res.code === 200) {
        this.dashboardAssetsCount = res.data;
      }
      this.utility.hideSpinner();
    });
  }

  // Create click function
  OnClick(type: string, assets: string, isSystem: boolean = false) {
    // "Repair",
    // "Trash",
    // "Assigned",
    // "Unassigned",
    if (isSystem) {
      this.router.navigate([NAVIGATION_ROUTES.SYSTEM_MANAGEMENT], {
        state: { type, assets },
      });
    } else {
      this.router.navigate([NAVIGATION_ROUTES.INVENTORY_MANAGEMENT], {
        state: { type, assets },
      });
    }
  }
}
