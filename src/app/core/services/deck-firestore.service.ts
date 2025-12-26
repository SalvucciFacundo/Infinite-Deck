import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  query,
  orderBy,
  increment,
} from '@angular/fire/firestore';
import { ImageMetadata, Comment } from '../models/deck.models';
import { Observable, tap } from 'rxjs';
import { DeckStateService } from './deck-state.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DeckFirestoreService {
  private firestore = inject(Firestore);
  private state = inject(DeckStateService);

  private imagesCollection = collection(this.firestore, 'images');

  getImages$(): Observable<ImageMetadata[]> {
    return (
      collectionData(this.imagesCollection, { idField: 'id' }) as Observable<ImageMetadata[]>
    ).pipe(tap((images) => this.state.setImages(images)));
  }

  images = toSignal(this.getImages$(), { initialValue: [] });

  async toggleLike(imageId: string, userId: string, isCurrentlyLiked: boolean) {
    const docRef = doc(this.firestore, 'images', imageId);

    await updateDoc(docRef, {
      likedBy: isCurrentlyLiked ? arrayRemove(userId) : arrayUnion(userId),
      likeCount: increment(isCurrentlyLiked ? -1 : 1),
    });
  }

  async addComment(comment: Omit<Comment, 'id' | 'createdAt'>) {
    const commentsCol = collection(this.firestore, `images/${comment.imageId}/comments`);
    await addDoc(commentsCol, {
      ...comment,
      createdAt: Date.now(),
    });

    const imgRef = doc(this.firestore, 'images', comment.imageId);
    await updateDoc(imgRef, {
      commentCount: increment(1),
    });
  }

  getComments(imageId: string): Observable<Comment[]> {
    const commentsCol = collection(this.firestore, `images/${imageId}/comments`);
    const q = query(commentsCol, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
  }
}
