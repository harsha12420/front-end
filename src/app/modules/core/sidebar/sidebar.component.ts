import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import sidebarMenu from '../../../globle/sidebar-menu';
import { ROUTE_PATH, COOKIES_KEY } from 'src/app/constants/constants';
import { UtilityService } from '../../services/utility.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  superAdminMenu: any = [];
  subAdminMenu: any = [];
  isDeviceLinkActive = false
  constructor(
    public router: Router, private utility: UtilityService, private cookieService: CookieService, private authService: AuthService
  ) { }

  async ngOnInit() {
    this.router.events
      .pipe(filter((events) => events instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (
          event.url == "/admin/settings"
        ) {
          this.isDeviceLinkActive = true;
        } else {
          this.isDeviceLinkActive = false;
        }
      });
      if (
        this.router.url == "/admin/settings"
      ) {
        this.isDeviceLinkActive = true;
      }
    this.superAdminMenu = sidebarMenu.getSuperAdmin(this.router.url)
    this.subAdminMenu = sidebarMenu.getSubAdmin(this.router.url)
  }

  logout() {
    this.authService.logout({ token: localStorage.getItem("token") }).then((res: any) => {
      localStorage.clear();
      this.router.navigate([`${ROUTE_PATH.LOGIN}`])
    }).catch((e: any) => {
      this.utility.showErrorToast(e);
    })
  }

  getHeader(item: any) {
    this.utility.getHeaderData(item.title);
    this.cookieService.set(COOKIES_KEY.HEADER_TITLE, `${item.title}`);
    this.router.navigate([`${item.routerLink}`])
    setTimeout(() => {
      this.superAdminMenu = sidebarMenu.getSuperAdmin(this.router.url)
    }, 100);
  }

  getHeaderForSetting(title: any) {
    this.utility.getHeaderData(title);
    setTimeout(() => {
      this.superAdminMenu = sidebarMenu.getSuperAdmin(this.router.url)
    }, 100);
    this.cookieService.set(COOKIES_KEY.HEADER_TITLE, `${title}`);
  }
}
