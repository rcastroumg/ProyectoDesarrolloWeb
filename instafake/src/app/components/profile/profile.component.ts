import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  constructor(
    public _authService: AuthService,
    public _userService: UserService
  ) {
  }

  ngOnInit() {
    console.log("Entro");

    this._userService.getDataUser();
  }
}
