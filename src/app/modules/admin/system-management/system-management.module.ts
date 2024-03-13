import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemManagementRoutingModule } from "./syatem-management-routing.module";
import { DetailPageComponent } from "./detail-page/detail-page.component";
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD-MM-YYYY',
    placement: 'auto',
    containerClass: 'theme-dark-blue'
  });
}

@NgModule({
  declarations: [DetailPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SystemManagementRoutingModule,
    BsDatepickerModule.forRoot()],
  providers: [{
    provide: BsDatepickerConfig,
    useFactory: getDatepickerConfig
  }]
})
export class SystemManagementModule { }
