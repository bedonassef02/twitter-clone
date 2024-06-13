import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
 
  authS: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.authS.autoLogin();
  }
}
