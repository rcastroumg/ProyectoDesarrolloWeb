import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewpostComponent {

  post = {
    comment: "",
    imageFile: "",
    imageB64: ""
  }

  newFile = {
    nombre: "",
    tipo: "",
    contenido: ""
  }

  imagen: any;

  constructor(
    private sanitizer: DomSanitizer,
    private postService: PostService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  onSubmit(form: NgForm) {
    this.spinner.show();
    console.log('Your form data:', form.value);

    var base64Index = this.post.imageB64.indexOf(';base64,') + ';base64,'.length;
    var base64 = this.post.imageB64.substring(base64Index);
    this.newFile.nombre = this.imagen.name;
    this.newFile.tipo = this.imagen.type;
    this.newFile.contenido = base64;

    this.postService.savePost(this.newFile, form.value.comment).then(() => {
      this.spinner.hide();
      this.router.navigate(["/profile"])
    })

  }

  catchFile(event: any) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);

    this.extraerBase64(this.imagen).then((img: any) => {
      this.post.imageB64 = img["base"];
    });
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };
    } catch (e) {
      resolve({
        base: null
      });
    }
  })

  convertDataURIToBinary(dataURI: any) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    var i: number = 0

    for (i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

}
