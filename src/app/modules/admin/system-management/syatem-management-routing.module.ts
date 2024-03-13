import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailPageComponent } from "./detail-page/detail-page.component";
import { ROUTE_PATH } from "src/app/constants/constants";
import { SystemManagementComponent } from "./system-management.component";

const routes: Routes = [
  {
    path: "",
    component: SystemManagementComponent,
  },
  {
    path: "details/:systemId",
    component: DetailPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemManagementRoutingModule { }
