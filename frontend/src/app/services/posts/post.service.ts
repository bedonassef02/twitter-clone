import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface Post {
  content: string;
  repost: string;
  images?: string[];
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor() {}
  // /
  private APIUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  createPost(post: Post) {
    this.http.post(`${this.APIUrl}post`, post);
  }
}
