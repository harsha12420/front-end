import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ROUTE_PATH } from "src/app/constants/constants";
import { InventoryManagementComponent } from "./inventory-management/inventory-management.component";
import { SystemManagementComponent } from "./system-management/system-management.component";
import { RightsManagementComponent } from "./rights-management/rights-management.component";
import { BillManagementComponent } from "./bill-management/bill-management.component";
import { SettingsComponent } from "./settings/settings.component";
import { DetailPageComponent } from "./inventory-management/detail-page/detail-page.component";
import { IotManagementComponent } from "./iot-management/iot-management.component";
import { IotDetailsManagementComponent } from "./iot-management/iot-details-management/iot-details-management.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: ROUTE_PATH.DASHBOARD,
        component: DashboardComponent,
      },
      {
        path: ROUTE_PATH.INVENTORY_MANAGEMENT,
        component: InventoryManagementComponent,
      },
      {
        path: ROUTE_PATH.INVENTORY_MANAGEMENT_DETAILS,
        component: DetailPageComponent,
      },
      {
        path: ROUTE_PATH.RIGHTS_MANAGEMENT,
        component: RightsManagementComponent,
      },
      {
        path: ROUTE_PATH.BILL_MANAGEMENT,
        component: BillManagementComponent,
      },
      {
        path: ROUTE_PATH.SETTINGS,
        component: SettingsComponent,
      },
      {
        path: ROUTE_PATH.IOT_MANAGEMENT,
        component: IotManagementComponent,
      },
      {
        path: ROUTE_PATH.IOT_MANAGEMENT_DETAILS,
        component: IotDetailsManagementComponent,
      },
      {
        path: ROUTE_PATH.SYSTEM_MANAGEMENT,
        loadChildren: () =>
          import("./system-management/system-management.module").then(
            (m) => m.SystemManagementModule
          ),
      },
      {
        path: ROUTE_PATH.REQUEST_MANAGEMENT,
        loadChildren: () =>
          import("./request-management/request-management.module").then(
            (m) => m.RequestManagementModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
