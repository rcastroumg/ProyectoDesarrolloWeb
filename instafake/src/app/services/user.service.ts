import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, of } from 'rxjs';
import { url_services } from '../config/url.services';
import { AuthService } from './auth.service';
import { ToFollow, UserData } from '../interfaces/UserData';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  basepath = url_services;
  myData = {
    "posts": [],
    "followers": [],
    "following": []
  } as UserData;

  toFollowings = [] as Array<ToFollow>;

  constructor(
    private http: HttpClient,
    private _authService: AuthService,
  ) {
    this.getStorageUserData();
  }

  getStorageUserData() {
    this.myData = this._authService.getUserData();
  }

  setStorageUserData() {
    this._authService.setUserData(this.myData);
  }

  async getDataUser() {
    let url = `${this.basepath}User/mydata`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);


    const retDataUser = this.http.get(url, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(retDataUser).then(data => {
      this.myData = JSON.parse(data) as UserData;
      this.setStorageUserData();
    });

  }

  async getToFollings() {
    let url = `${this.basepath}User/tofollwing`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);


    const retToFollowings = this.http.get(url, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(retToFollowings).then(data => {
      this.toFollowings = JSON.parse(data) as Array<ToFollow>;
    });
  }


  async follow(useridFollow: number) {
    let url = `${this.basepath}User/follow`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);

    const params = {
      useridFollow: useridFollow
    };

    const retFollow = this.http.post(url, params, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(retFollow).then(async data => {
      await this.getDataUser();
      await this.getToFollings();
    });
  }

  async unfollow(useridFollow: number) {
    let url = `${this.basepath}User/unfollow`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);

    const params = {
      useridFollow: useridFollow
    };

    const retFollow = this.http.post(url, params, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(retFollow).then(async data => {
      await this.getDataUser();
      await this.getToFollings();
    });
  }
}
