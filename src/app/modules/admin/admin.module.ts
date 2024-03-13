import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from '../core/sidebar/sidebar.component';
import { HeaderComponent } from '../core/header/header.component';
import { AdminRoutingModule } from './adimn-routing.module';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { SystemManagementComponent } from './system-management/system-management.component';
import { RequestManagementComponent } from './request-management/request-management.component';
import { RightsManagementComponent } from './rights-management/rights-management.component';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BillManagementComponent } from './bill-management/bill-management.component';
import { SettingsComponent } from './settings/settings.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DetailPageComponent } from './inventory-management/detail-page/detail-page.component';
import { IotManagementComponent } from './iot-management/iot-management.component';
import { IotDetailsManagementComponent } from './iot-management/iot-details-management/iot-details-management.component';

export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'DD-MM-YYYY',
    placement: 'auto',
    containerClass: 'theme-dark-blue'
  });
}

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    SidebarComponent,
    HeaderComponent,
    InventoryManagementComponent,
    SystemManagementComponent,
    RequestManagementComponent,
    RightsManagementComponent,
    BillManagementComponent,
    SettingsComponent,
    DetailPageComponent,
    IotManagementComponent,
    IotDetailsManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule
  ],
  providers: [{
    provide: BsDatepickerConfig,
    useFactory: getDatepickerConfig
  }]
})
export class AdminModule { }
