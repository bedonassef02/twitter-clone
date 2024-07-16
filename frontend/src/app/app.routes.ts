import { Routes } from '@angular/router';
import { Logout } from './pages/logout/logout.component';

import { MainContent } from './pages/main-content/main-content.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './services/auth/auth.guard';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { NotificationComponent } from './pages/notification/notification.component';

export const routes: Routes = [
  {
    path: '',
    component: MainContent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'notification',
        component: NotificationComponent,
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
];
