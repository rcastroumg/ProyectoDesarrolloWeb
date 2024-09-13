import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-newpost',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.scss'
})
export class NewpostComponent {

  onSubmit(form: NgForm) {
    console.log('Your form data:', form.value);
  }

}
