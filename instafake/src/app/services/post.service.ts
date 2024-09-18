import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { url_services } from '../config/url.services';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  basepath = url_services;

  constructor(
    private http: HttpClient,
    private _authService: AuthService
  ) { }

  async savePost(data: any, comment: string) {
    let error = "";
    let url = `${this.basepath}Files/save`;

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this._authService.token);

    const params = {
      NombreArchivo: data.nombre,
      TipoContenido: data.tipo,
      Contenido: data.contenido
    };

    const IDArchivoPromise = this.http.post(url, params, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    const IDArchivo = await lastValueFrom(IDArchivoPromise)

    console.log(IDArchivo);

    url = `${this.basepath}Posts/save`;

    const params2 = {
      image: IDArchivo,
      caption: comment
    };

    const IDPostPromise = this.http.post(url, params2, { headers: headers })
      .pipe(
        map(res => JSON.stringify(res))
      );

    await lastValueFrom(IDPostPromise).catch(error => {
      error = data;
    });
  }
}
