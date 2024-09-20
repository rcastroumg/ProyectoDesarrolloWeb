import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, of } from 'rxjs';
import { url_services } from '../config/url.services';
import { AuthService } from './auth.service';
import { UserData } from '../interfaces/UserData';

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

  toFollowings = [];

  constructor(
    private http: HttpClient,
    private _authService: AuthService
  ) { }

  getDataUser() {
    let url = `${this.basepath}User/mydata`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);


    this.http.get(url, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      )
      .subscribe(data => {
        this.myData = JSON.parse(data) as UserData;
      });

  }

  getToFollings(){
    let url = `${this.basepath}User/tofollwing`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);


    this.http.get(url, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      )
      .subscribe(data => {
        this.toFollowings = JSON.parse(data);
      });
  }


  follow(useridFollow:number){
    let url = `${this.basepath}User/follow`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);

    const params = {
      useridFollow: useridFollow
    };

    this.http.post(url, params, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      )
      .subscribe(data => {
        this.getDataUser();
        this.getToFollings();
      });
  }

  unfollow(useridFollow:number){
    let url = `${this.basepath}User/unfollow`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);

    const params = {
      useridFollow: useridFollow
    };

    this.http.post(url, params, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      )
      .subscribe(data => {
        this.getDataUser();
        this.getToFollings();
      });
  }
}
