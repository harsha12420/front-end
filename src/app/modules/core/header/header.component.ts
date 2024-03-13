import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { CookieService } from 'ngx-cookie-service';
import { COOKIES_KEY } from 'src/app/constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  headerName: any;
  imageURL: any;

  constructor(
    public router: Router, private utility: UtilityService, private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.utility.userProfileData.subscribe((data:any) => {
      if(data){
        this.imageURL = data.vImageUrl
      }
    })
    this.headerName = this.cookieService.get(COOKIES_KEY.HEADER_TITLE);
    this.utility.headerData.subscribe((value: any) => {
      this.headerName = value;
    });
  }
}
