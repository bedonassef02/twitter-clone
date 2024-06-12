import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-LSidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class LeftSidebarComponent {
  router: Router = inject(Router);

  navToProfile() {
    this.router.navigate(['/profile']);
  }
}
