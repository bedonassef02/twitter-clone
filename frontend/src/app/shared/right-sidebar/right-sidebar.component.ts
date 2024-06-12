import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-RSidebar',
  standalone: true,
  imports: [
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {}
