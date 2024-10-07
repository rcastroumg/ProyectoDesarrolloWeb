import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  posts:any = [];

  constructor(
    public _postService:PostService,
    public spinner:NgxSpinnerService
  ){}

  ngOnInit(){
    this.spinner.show();
    this._postService.getPots().then( data => {
      this.spinner.hide();
      this.posts = data;
      console.log(this.posts);
    });
  }
}
