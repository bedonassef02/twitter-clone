import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor() {}
  http: HttpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getNotifications() {
    return this.http.get<any>(`${this.apiUrl}notifications`);
  }

  getNotificationSCount() {
    return this.http.get<number>(`${this.apiUrl}notifications/count`);
  }
}
