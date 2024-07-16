import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface PostResponse {
  id: number;
  user: string;
  repost: string;
  content: string;
  images: string[];
  type: string;
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor() {}

  private APIUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  createPost(postData: FormData) {
    return this.http.post<PostResponse>(
      'https://twitter-api-ld6h.onrender.com/posts',
      postData
    );
  }
}
