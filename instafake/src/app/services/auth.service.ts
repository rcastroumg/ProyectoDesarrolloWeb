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
  redirectUrl: string = "";

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
    let user: any;

    let url = `${this.basepath}User/token`;

    let data = new FormData();
    data.append("username", email);
    data.append("password", "");

    const getToken = this.http.post(url, data)
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(getToken).then(resp => {
      let mytoken = JSON.parse(resp) as { access_token: string, token_type: string }
      this.token = mytoken["access_token"];
    });

    console.log(this.token);


    url = `${this.basepath}User/me`;

    let headers = new HttpHeaders();
    //headers.set("accept","application/json");
    headers = headers.set("Authorization", "Bearer " + this.token);


    const getUser = this.http.get(url, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(getUser).then(resp => {
      let myuser = JSON.parse(resp) as { id: number, username: string, email: string, profile_picture: string }
      user = myuser;
    });

    return [this.token, user];

  }

  logout() {
    this.limpiar_perfil();
    this.saveStorage();
    this.loggedId = false;
  }

  info_token(token: string) {
    let url = "";
    url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;

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
    this.token = token;
  }

  limpiar_perfil() {
    this.perfil.nombres = "";
    this.perfil.apellidos = "";
    this.perfil.email = "";
    this.perfil.foto = "";
    this.token = "";
  }


  saveStorage() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      localStorage.setItem('email', this.perfil.email);
      localStorage.setItem('nombres', this.perfil.nombres);
      localStorage.setItem('apellido', this.perfil.apellidos);
      localStorage.setItem('foto', this.perfil.foto);
    }
    else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('nombres');
      localStorage.removeItem('apellido');
      localStorage.removeItem('foto');
    }
  }

  loadStorage() {
    if (localStorage.getItem('token')) { this.token = localStorage.getItem('token')!; this.loggedId = true }
    if (localStorage.getItem('nombres')) this.perfil.nombres = localStorage.getItem('nombres')!;
    if (localStorage.getItem('apellidos')) this.perfil.apellidos = localStorage.getItem('apellidos')!;
    if (localStorage.getItem('email')) this.perfil.email = localStorage.getItem('email')!;
    if (localStorage.getItem('foto')) this.perfil.foto = localStorage.getItem('foto')!;
  }
}
