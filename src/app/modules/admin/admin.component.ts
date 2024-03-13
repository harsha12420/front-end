import { Component } from '@angular/core';
import { UtilityService } from '../services/utility.service';
import { AdminService } from '../services/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(private utilityService:UtilityService,private adminService: AdminService){
    this.getUserDetails()
  }

  getUserDetails() {
    this.utilityService.showLoading();
    this.adminService.getUserProfile().then((res: any) => {
      if (res.code === 200) {
        this.utilityService.userProfileData.next(res.data)
      }
    })
    this.utilityService.hideLoading();
  }
}
