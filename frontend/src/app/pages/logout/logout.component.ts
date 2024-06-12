import { Component, OnInit, inject, Renderer2, Inject } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../services/auth/auth.service';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
const PRIM_CMP = [
  DialogModule,
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  PasswordModule,
  StyleClassModule,
];

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent, PRIM_CMP],
  selector: 'app-logout',
  templateUrl: 'logout.component.html',
  styleUrls: ['logout.component.scss'],
})
export class Logout implements OnInit {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}
  router: Router = inject(Router);
  authS: AuthService = inject(AuthService);
  visible: boolean = false;
  login = false;
  value = '';
  error = false;
  isLoading = false;
  toggleRM() {
    this.login = !this.login;
  }

  showDialog() {
    this.visible = true;
  }
  ngOnInit() {
    this.handleUserClicks();
  }
  onSubmit(form: NgForm) {
    this.isLoading = true;
    let obs: Observable<User>;
    const name = form.value.name;
    const username = form.value.username;
    const password = form.value.password;
    console.log(name, username, password);

    if (!this.login) {
      obs = this.authS.signUp(name, username, password);
    } else {
      obs = this.authS.signIn(username, password);
    }
    obs.subscribe({
      next: (userInfo) => {
        this.isLoading = false;
        console.log(userInfo.access_token);
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.isLoading = false;
        this.error = true;
        console.log(error);
      },
    });
  }

  handleUserClicks() {
    // Find all links with the class 'signup' and 'sign'
    const signupLinks = this.document.querySelectorAll('.signup');
    const signLinks = this.document.querySelectorAll('.signin');

    // Listen for clicks on signup links and set login to false
    signupLinks.forEach((link) => {
      this.renderer.listen(link, 'click', () => {
        this.login = false;
      });
    });

    // Listen for clicks on sign links and set login to true
    signLinks.forEach((link) => {
      this.renderer.listen(link, 'click', () => {
        this.login = true;
      });
    });
  }
}
