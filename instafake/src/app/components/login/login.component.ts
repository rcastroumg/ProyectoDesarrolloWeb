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

    if (this._authService.perfil.email) {
      const redirect = this._authService.redirectUrl ? this._authService.redirectUrl : 'home';
      this._router.navigate([redirect]);
    }
    this._socialAuthService.authState.subscribe((user) => {
      this.user = user;

      this._authService.info_token(this.user.idToken).subscribe(inftoken => {
        let inftokenObj = inftoken as { picture: string, name: string, family_name: string, given_name: string, email: string }
        this._authService.login(this.user!.email)
          .then(datos => {
            console.log(datos);
            console.log(inftoken);
            this._authService.cargar_parfil(datos[1].email, inftokenObj.given_name, inftokenObj.family_name, datos[1].username, (datos[1].foto ? datos[1].foto : inftokenObj.picture), datos[0]);
            this._authService.saveStorage();
            this._router.navigate(['home']);
          })
          .catch(error => {
            if (error.status == 401) {
              this._router.navigate(['register']);
            }

          });
      })

      /* console.log(user);

      this.loggedIn = (user != null);
      this._authService.login(this.user.email);
      this._router.navigate(['home']);

      this._authService.saveStorage(this.loggedIn); */
    });
  }

  signInInstaFake() {

  }

  signInWithGoogle(): void {
    console.log("entro");

    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this._socialAuthService.signOut();
  }

}
