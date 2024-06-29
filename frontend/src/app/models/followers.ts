export interface Followers {
  followers: FollowersDTO[];
}
export interface FollowersDTO {
  id: string;
  followerId: string;
  followingId: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}
