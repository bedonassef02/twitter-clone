import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-LSidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class LeftSidebarComponent implements OnInit {
  profileS: ProfileService = inject(ProfileService);
  userLogo: string;
  router: Router = inject(Router);
  name: string;
  ngOnInit(): void {
    this.authS.userSub.subscribe((user) => {
      if (!user) {
        return;
      }
      this.userName = user.username;
      this.userLogo = user.username.charAt(0);
      this.userLogo = user.username.charAt(0);
      this.name = user.name;
    });
  }
  userName;

  navToProfile() {
    this.router.navigate(['/profile']);
  }

  authS: AuthService = inject(AuthService);
  logOut() {
    this.router.navigate(['/logout']);
    this.authS.logOut();
  }
}
