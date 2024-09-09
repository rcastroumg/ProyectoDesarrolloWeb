import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('338657833350-0nh8s5v40ra1pkgq5hhd37vn76f3pfed.apps.googleusercontent.com')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
})
export class LoginComponent {

  user: SocialUser | null = null;
  loggedIn: boolean = false;

  constructor(private _socialAuthService: SocialAuthService,
    public _authService: AuthService,
    public _router: Router) { }

  ngOnInit(): void {
    this._authService.loadStorage();
    console.log(this._authService.loggedId);

    if (this._authService.loggedId) {
      this._router.navigate(['home']);
    }
    this._socialAuthService.authState.subscribe((user) => {
      console.log(user);

      this.user = user;
      this.loggedIn = (user != null);
      this._authService.login(this.user.email);
      this._router.navigate(['home']);

      this._authService.saveStorage(this.loggedIn);
    });
  }

  signInWithGoogle(): void {
    console.log("entro");

    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this._socialAuthService.signOut();
  }

}
