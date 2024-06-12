import { Component, OnInit } from '@angular/core';
import { LeftSidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RightSidebarComponent } from '../../shared/right-sidebar/right-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [LeftSidebarComponent, RightSidebarComponent, RouterModule],
  selector: 'app-main',
  templateUrl: 'main-content.component.html',
  styleUrls: ['main-content.component.scss'],
})
export class MainContent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
