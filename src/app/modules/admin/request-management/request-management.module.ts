import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailPageComponent } from "./detail-page/detail-page.component";
import { RequestManagementRoutingModule } from "./request-management-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [DetailPageComponent],
  imports: [
    CommonModule,
    RequestManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class RequestManagementModule { }
