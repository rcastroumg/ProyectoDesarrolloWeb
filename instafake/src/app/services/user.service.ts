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

  constructor(
    private http:HttpClient,
    private _authService:AuthService
  ) { }

  getDataUser(){
    let url = `${this.basepath}User/mydata`;

    let headers = new HttpHeaders();
    //headers.set("accept","application/json");
    headers = headers.set("Authorization", "Bearer " + this._authService.token);


    this.http.get(url)
      .pipe(
        map(res => JSON.stringify(res))
      )
      .subscribe(data => {
        this.myData = JSON.parse(data) as UserData;
      });

  }
}
