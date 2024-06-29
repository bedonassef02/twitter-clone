import { Component, OnInit, inject, Renderer2, Inject } from '@angular/core';
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
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
export const PRIM_CMP = [
  DialogModule,
  ButtonModule,
  InputTextModule,
  FloatLabelModule,
  PasswordModule,
  StyleClassModule,
  InputTextareaModule,
];

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, PRIM_CMP, LoadingSpinner],
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
  error = null;
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
    if (this.login) {
      console.log(username, password);
    } else {
      console.log(name, username, password);
    }

    const unWS = username.replace(/\s+/g, '');
    if (!this.login) {
      obs = this.authS.signUp(name, unWS, password);
    } else {
      obs = this.authS.signIn(unWS, password);
    }
    obs.subscribe({
      next: (userInfo) => {
        this.isLoading = false;

        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error;
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
  cancelError() {
    this.error = null;
  }
}
