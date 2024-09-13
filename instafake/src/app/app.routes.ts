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
        loadComponent: () => import('./components/sidebar/sidebar.component').then(m => m.SidebarComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                loadComponent: ()=>import('./components/home/home.component').then(m=>m.HomeComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'newpost',
                loadComponent: () => import('./components/newpost/newpost.component').then(m => m.NewpostComponent)
            },
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./components/notfound/notfound.component').then(m => m.NotfoundComponent)
    }
];
