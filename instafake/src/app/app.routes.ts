import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { authGuard } from './components/login/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '**',
        component: NotfoundComponent
    }
];
