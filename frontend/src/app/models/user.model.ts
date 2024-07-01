export interface User {
  access_token?: string;
  name?: string;
  username?: string;
  id?: string;
}

export interface UserInfo {
  id: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  birthDate: string;
  location: string;
  website: string;
  isPrivate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserActions {
  likes: 0;
  posts: 0;
  followers: 0;
  following: 0;
  media: 0;
}

export interface UserProfileDTO {
  name?: string;
  bio?: string;
  birthDate?: Date;
  location?: string;
  website?: string;
  isPrivate?: true;
}

export class UserProfileInfo {
  constructor(
    public bio: string,
    public location: string,
    public website: string,
    public birthDate?: Date
  ) {}
}
