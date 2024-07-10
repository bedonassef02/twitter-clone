import { Component, inject, OnInit } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notifications/notifications.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  NotificationsService: NotificationService = inject(NotificationService);

  notifications$ = this.NotificationsService.getNotifications();
  notificationCount = 0;
  notificationsCount$ = this.NotificationsService.getNotificationSCount();
  ngOnInit(): void {
    this.NotificationsService.getNotifications().subscribe((response) => {
      console.log(response);
    });
    this.NotificationsService.getNotificationSCount().subscribe((response) => {
      console.log(response);
      this.notificationCount = response;
    });
  }
}
