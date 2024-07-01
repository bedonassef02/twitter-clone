import { CommonModule, formatDate } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import {
  ProfileService,
  profileResponse,
} from '../../services/profile/profile.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { PRIM_CMP } from '../logout/logout.component';
import { LoadingSpinner } from '../../shared/loading-spinner/loading-spinner';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import {
  UserInfo,
  UserProfileDTO,
  UserProfileInfo,
} from '../../models/user.model';
import { MaterialExamples } from '../../constatns/ng-material-itmes';
import { provideNativeDateAdapter } from '@angular/material/core';
import { userInfo } from 'os';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinner,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    PRIM_CMP,
    AvatarModule,
    MaterialExamples,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [provideNativeDateAdapter(), MessageService],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(private messageService: MessageService) {}
  router: Router = inject(Router);
  private fb: FormBuilder;
  pService: ProfileService = inject(ProfileService);
  authS: AuthService = inject(AuthService);
  sub$: Subscription[] = [];
  username = this.authS.userSub.getValue().username;
  name = this.authS.userSub.getValue().name;
  LogoChar;
  followers: number;
  following: number;
  posts: number;
  createdAt: Date;
  showDate = false;
  birthDate: Date;
  visible: boolean = false;
  USerProfileDetails: UserInfo;
  formGroup: FormGroup;
  userDate: Date = new Date();

  ngOnInit(): void {
    this.authS.userSub.subscribe((user) => {
      if (user) {
        // const usernameWithoutSpaces = username.replace(/\s+/g, '');
        this.username = user.username;
        const userNameWS = user.username.replace(/\s+/g, '');
        this.getFollowers(userNameWS);
      }
    });

    // this.getUserInfo();
    this.getUserLogo();
    this.initForm();
  }

  editProfile() {
    this.visible = true;
  }

  toggleDateMode() {
    this.showDate = !this.showDate;
  }

  getUserInfo() {
    this.pService.getUserName(this.username).subscribe((userData) => {
      this.pService.profileSubject.next(userData);
      this.createdAt = new Date(userData.createdAt);
    });
  }

  ngOnDestroy(): void {
    this.sub$.forEach((sub) => sub.unsubscribe());
  }

  getUserLogo() {
    const USERNAME = this.authS.userSub.getValue().username;
    const firstLetter = USERNAME.charAt(0);
    this.LogoChar = firstLetter;
  }

  getFollowers(username: string) {
    this.pService.getFollowers(username).subscribe(
      (userInfo) => {
        this.followers = userInfo.followers;
        this.following = userInfo.following;
        this.posts = userInfo.posts;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    let bio = this.formGroup.value.bio;
    let location = this.formGroup.value.location;
    let website = this.formGroup.value.website;
    let birthDate = this.formGroup.value.birthDate;
    const userInfo = new UserProfileInfo(
      bio,
      location,
      website,
      new Date(birthDate)
    );
    this.pService.editProfile(userInfo);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your profile updated successfully',
    });
    setTimeout(() => {
      this.visible = false;
    }, 100);
  }

  private initForm() {
    // Initialize the form with empty values or default values
    this.formGroup = new FormGroup({
      bio: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      website: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
    });

    // Fetch user info and set form values
    this.pService.getUserName(this.username).subscribe((userInfo) => {
      if (userInfo) {
        this.setUserFormValues(userInfo);
      }
    });
  }

  // Separate method to set form values
  private setUserFormValues(userInfo: any) {
    this.formGroup.setValue({
      bio: userInfo.bio || '',
      location: userInfo.location || '',
      website: userInfo.website || '',
      birthDate: userInfo.birthDate || '',
    });

    this.birthDate = new Date(userInfo.birthDate);
  }
}
