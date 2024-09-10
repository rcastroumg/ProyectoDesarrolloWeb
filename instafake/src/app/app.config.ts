import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('338657833350-0nh8s5v40ra1pkgq5hhd37vn76f3pfed.apps.googleusercontent.com', {
              oneTapEnabled: false,
            }),
          },
        ],
        onError: (err) => {
          console.log("dio error");
          console.error(err);

        },
      } as SocialAuthServiceConfig,
    },
    provideHttpClient(),
  ],
};
