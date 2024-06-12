import { Routes } from '@angular/router';
import { Logout } from './pages/logout/logout.component';
import { LoginComponent } from './pages/login/login.component';
import { MainContent } from './pages/main-content/main-content.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainContent,
    children: [
      {
        path: 'home',
        component: MainContent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'logout',
    component: Logout,
  },

  {
    path: 'login',
    component: LoginComponent,
  },
];
