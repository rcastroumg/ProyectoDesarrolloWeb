import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, of } from 'rxjs';
import { url_services } from '../config/url.services';
import { Perfil } from '../config/perfil.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  basepath = url_services;
  perfil = Perfil
  token = "";
  loggedId: boolean = false;
  constructor(
    public http: HttpClient, 
  ) { }

  isAuth() {
    return this.token.length > 0;
  }


  async login(email: string) {
    /* console.log(idUsuario);

    this.token = idUsuario;
    this.loggedId = true; */
    let user:any;

    let url = `${this.basepath}User/token`;

    let data = new FormData();
    data.append("username",email);
    data.append("password","");

    const getToken = this.http.post(url,data)
    .pipe(
      map(res=>JSON.stringify(res))
    );

    await lastValueFrom(getToken).then(resp => {
      let mytoken = JSON.parse(resp) as {access_token:string,token_type:string}
      this.token = mytoken["access_token"];      
    });

    console.log(this.token);


    url = `${this.basepath}User/me`;

    let headers = new HttpHeaders();
    //headers.set("accept","application/json");
    headers = headers.set("Authorization","Bearer "+this.token);
    

    const getUser = this.http.get(url,{headers: headers})
    .pipe(
      map(res=>JSON.stringify(res))
    );

    await lastValueFrom(getUser).then(resp => {
      let myuser = JSON.parse(resp) as {id:number, username:string,email:string,profile_picture:string}
      user = myuser;            
    });

    return [this.token,user];

  }

  info_token(token: string) {
    let url = "";
    url = `https://oauth2.googleapis.com/tokeninfo?id_token=${ token }`;

    return this.http.get(url)
      .pipe(
        map(resp => resp),
        catchError(() => {
          return of();
        })
      )
  }

  cargar_parfil(
    email: string,
    nombres: string,
    apellidos: string,
    foto: string,
    token: string
  ) {
    this.loggedId = true;
    this.perfil.email = email;
    this.perfil.nombres = nombres;
    this.perfil.apellidos = apellidos;
    this.perfil.foto = foto;
  }


  saveStorage(loggedIn: boolean) {
    if (loggedIn) {
      localStorage.setItem('loggedIn', 'true');
    }
    else {
      localStorage.removeItem('loggedIn');
    }
  }

  loadStorage() {
    if (localStorage.getItem('loggedIn')) {
      this.loggedId = true;
      this.token = "log"
    }
  }
}
