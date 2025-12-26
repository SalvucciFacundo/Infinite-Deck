import { Injectable, signal, computed } from '@angular/core';
import { ViewportPosition, ImageMetadata, ViewMode } from '../models/deck.models';

@Injectable({
  providedIn: 'root',
})
export class DeckStateService {
  // --- Signals ---
  private _viewMode = signal<ViewMode>('canvas');
  private _viewport = signal<ViewportPosition>({ x: 0, y: 0, zoom: 1 });
  private _images = signal<ImageMetadata[]>([]);
  private _selectedImage = signal<ImageMetadata | null>(null);
  private _isLoading = signal<boolean>(false);

  // --- Exposed Selectors (Computed) ---
  viewMode = this._viewMode.asReadonly();
  viewport = this._viewport.asReadonly();
  images = this._images.asReadonly();
  selectedImage = this._selectedImage.asReadonly();
  isLoading = this._isLoading.asReadonly();

  // --- Actions ---
  setViewMode(mode: ViewMode) {
    this._viewMode.set(mode);
  }

  updateViewport(update: Partial<ViewportPosition>) {
    this._viewport.update((prev) => ({ ...prev, ...update }));
  }

  setImages(images: ImageMetadata[]) {
    this._images.set(images);
  }

  selectImage(image: ImageMetadata | null) {
    this._selectedImage.set(image);
  }

  setLoading(loading: boolean) {
    this._isLoading.set(loading);
  }
}
