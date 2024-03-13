import { HttpRequestsService } from '../http-requests.service';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { LOCAL_STORAGE_KEYS } from '../../../constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  constructor(private localstorage: LocalStorageService, private http: HttpRequestsService) {
    this.currentUserSubject = new BehaviorSubject<boolean>(!!this.localstorage.getLocalStore(LOCAL_STORAGE_KEYS.TOKEN));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public isLoggedIn(): boolean {
    return !!this.localstorage.getLocalStore(LOCAL_STORAGE_KEYS.TOKEN);
  }

  login( data:any ) {
    return this.http.post('/common/v1/login', data, false)
  }

  forgotPassword( data:any ) {
    return this.http.post('/common/v1/forgot-password', data, false)
  }

  checkURLToken( token:any ) {
    return this.http.get('/common/v1/check-url-token/' + token, false)
  }

  resetPassword( data:any ) {
    return this.http.post('/common/v1/reset-password', data, false)
  }

  logout( data:any ) {
    return this.http.post('/common/v1/logout', data)
  }
}
