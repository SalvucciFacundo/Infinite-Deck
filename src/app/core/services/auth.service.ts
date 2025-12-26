import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserProfile } from '../models/deck.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Expose the current user as a signal
  currentUser = toSignal(user(this.auth));
  userProfile = signal<UserProfile | null>(null);

  // Convenience signal for checking if logged in
  isAuthenticated = signal<boolean>(false);

  constructor() {
    user(this.auth).subscribe(async (u) => {
      this.isAuthenticated.set(!!u);
      if (u) {
        const profile = await this.getUserProfile(u.uid);
        this.userProfile.set(profile);
      } else {
        this.userProfile.set(null);
      }
    });
  }

  async login(email: string, pass: string): Promise<User | null> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, pass);
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, pass: string, displayName: string): Promise<User | null> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName });

        // Create profile document in Firestore
        const profile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: displayName,
          joinedAt: Date.now(),
        };
        await setDoc(doc(this.firestore, 'users', result.user.uid), profile);
      }
      return result.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  private async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(this.firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    } catch (e) {
      console.error('Error fetching profile:', e);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
