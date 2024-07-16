import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/profile/profile.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PRIM_CMP } from '../../pages/logout/logout.component';
import { PostService } from '../../services/posts/post.service';
import { MessageService } from 'primeng/api';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-LSidebar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, PRIM_CMP, ToastModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [provideNativeDateAdapter(), MessageService],
})
export class LeftSidebarComponent implements OnInit {
  constructor(private messageService: MessageService) {}
  profileS: ProfileService = inject(ProfileService);
  authS: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  userName;
  userLogo: string;
  router: Router = inject(Router);
  name: string;
  visible = false;
  selectedFiles: File[] = [];

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
    this.initForm();
  }

  navToProfile() {
    this.router.navigate(['/profile']);
  }

  logOut() {
    this.router.navigate(['/logout']);
    this.authS.logOut();
  }

  //**************** Posts Form ***************//

  formGroup: FormGroup;

  editProfile() {
    this.visible = true;
  }

  private initForm() {
    this.formGroup = new FormGroup({
      content: new FormControl(''),
      repost: new FormControl(''),
      images: new FormControl(''),
      type: new FormControl(''),
    });
  }

  onFileChange(event: any) {
    const files = event.target.files;
    for (let file of files) {
      this.selectedFiles.push(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('content', this.formGroup.get('content')?.value || '');

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append(
        'images',
        this.selectedFiles[i],
        this.selectedFiles[i].name
      );
    }

    console.log('FormData:', formData);

    this.postService.createPost(formData).subscribe((response) => {
      console.log(response);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Post created',
      });
    });
    this.formGroup.reset();
  }
}
