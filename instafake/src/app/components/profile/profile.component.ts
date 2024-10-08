import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent {

  constructor(
    public _authService: AuthService,
    public _userService: UserService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    console.log("Entro");
    //this.spinner.show()

    this._userService.getDataUser();
    this._userService.getToFollings();
  }

  async callFollow(userid: number) {
    this.spinner.show()
    await this._userService.follow(userid);
    this.spinner.hide()
  }

  async callUnfollow(userid: number) {
    this.spinner.show()
    await this._userService.unfollow(userid);
    this.spinner.hide()
  }
}
