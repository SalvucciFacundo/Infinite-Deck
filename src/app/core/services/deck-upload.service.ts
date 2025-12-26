import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, listAll } from '@angular/fire/storage';
import { Firestore, collection, addDoc, getDocs, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { DeckStateService } from './deck-state.service';
import { ImageMetadata } from '../models/deck.models';

@Injectable({
  providedIn: 'root',
})
export class DeckUploadService {
  private storage = inject(Storage);
  private firestore = inject(Firestore);
  private state = inject(DeckStateService);
  private auth = inject(AuthService);

  private getSpiralPosition(n: number) {
    const angle = n * 137.5 * (Math.PI / 180);
    const r = 180 * Math.sqrt(n); // Reduced spacing for collage effect (was 500)
    return {
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    };
  }

  async syncExistingImages(): Promise<void> {
    this.state.setLoading(true);
    try {
      const imagesCollection = collection(this.firestore, 'images');
      const snapshot = await getDocs(imagesCollection);
      const storageRef = ref(this.storage, 'images');
      const result = await listAll(storageRef);

      const existingData = new Map<string, { id: string; url: string }>();
      snapshot.forEach((doc) => {
        const data = doc.data();
        existingData.set(data['title'], { id: doc.id, url: data['url'] });
      });

      let currentIndex = snapshot.size;
      let syncedCount = 0;
      let updatedCount = 0;

      for (const item of result.items) {
        const title = item.name.split('.')[0];
        const downloadURL = await getDownloadURL(item);

        if (existingData.has(title)) {
          // Update URL if it's different (refresh token)
          const existing = existingData.get(title)!;
          if (existing.url !== downloadURL) {
            await setDoc(
              doc(this.firestore, 'images', existing.id),
              { url: downloadURL },
              { merge: true }
            );
            updatedCount++;
          }
        } else {
          // Add new image
          const pos = this.getSpiralPosition(currentIndex);
          const metadata: Omit<ImageMetadata, 'id'> = {
            url: downloadURL,
            width: 400,
            height: 300,
            x: pos.x + (Math.random() * 40 - 20), // Reduced jitter for tight collage
            y: pos.y + (Math.random() * 40 - 20),
            aspectRatio: 1,
            title: title,
            blurHash: 'L8E.i_00%M%M00~q_3Rj00%M%M00',
          };
          await addDoc(imagesCollection, metadata);
          syncedCount++;
          currentIndex++;
        }
      }
      console.log(`Sync complete. Added: ${syncedCount}, Updated URLs: ${updatedCount}`);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.state.setLoading(false);
    }
  }

  /**
   * Re-calculates positions for ALL images to create a dense spiral.
   * Useful for "fixing" a messy canvas.
   */
  async reorganizeCanvas(): Promise<void> {
    this.state.setLoading(true);
    try {
      const imagesCollection = collection(this.firestore, 'images');
      const snapshot = await getDocs(imagesCollection);

      let index = 0;
      for (const docSnap of snapshot.docs) {
        const pos = this.getSpiralPosition(index);
        const docRef = docSnap.ref;

        await setDoc(
          docRef,
          {
            x: pos.x + (Math.random() * 30 - 15),
            y: pos.y + (Math.random() * 30 - 15),
          },
          { merge: true }
        );

        index++;
      }
      console.log('Canvas reorganized successfully');
    } catch (error) {
      console.error('Reorganize error:', error);
    } finally {
      this.state.setLoading(false);
    }
  }

  async uploadImage(file: File): Promise<void> {
    this.state.setLoading(true);
    try {
      // 1. Upload to Storage
      const filePath = `images/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Prepare Metadata (Next Spiral Position)
      const imagesCollection = collection(this.firestore, 'images');
      const currentCount = (await getDocs(imagesCollection)).size;
      const pos = this.getSpiralPosition(currentCount);

      const metadata: Omit<ImageMetadata, 'id'> = {
        url: downloadURL,
        width: 400,
        height: 300,
        x: pos.x + (Math.random() * 40 - 20),
        y: pos.y + (Math.random() * 40 - 20),
        aspectRatio: 1.33,
        title: file.name.split('.')[0],
        blurHash: 'L8E.i_00%M%M00~q_3Rj00%M%M00',
        userId: this.auth.currentUser()?.uid,
      };

      // 3. Save to Firestore
      await addDoc(imagesCollection, metadata);

      console.log('Image uploaded and registered:', file.name);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      this.state.setLoading(false);
    }
  }
}
