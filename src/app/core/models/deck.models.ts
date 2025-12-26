export interface ViewportPosition {
  x: number;
  y: number;
  zoom: number;
}

export interface ImageMetadata {
  id: string;
  url: string;
  blurHash?: string;
  width: number;
  height: number;
  x: number; // for canvas
  y: number; // for canvas
  aspectRatio: number; // for masonry
  title?: string;
  userId?: string; // owner ID
  likeCount?: number;
  likedBy?: string[]; // array of user UIDs
  commentCount?: number;
}

export interface Comment {
  id: string;
  imageId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  text: string;
  createdAt: number;
}

export type ViewMode = 'canvas' | 'grid';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  joinedAt: number;
}
