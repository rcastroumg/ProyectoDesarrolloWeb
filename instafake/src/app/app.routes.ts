import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { authGuard } from './components/login/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NewpostComponent } from './components/newpost/newpost.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '',
        component: SidebarComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'newpost',
                component: NewpostComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '**',
        component: NotfoundComponent
    }
];
