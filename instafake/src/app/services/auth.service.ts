import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = "";
  loggedId: boolean = false;
  constructor() { }

  isAuth() {
    return this.token.length > 0;
  }


  login(idUsuario: string) {
    console.log(idUsuario);

    this.token = idUsuario;
    this.loggedId = true;
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
