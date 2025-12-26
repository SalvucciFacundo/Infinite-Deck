import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private _showAuthModal = signal(false);
  private _triggerUpload = signal(0);

  showAuthModal = this._showAuthModal.asReadonly();
  triggerUpload = this._triggerUpload.asReadonly();

  openAuthModal() {
    this._showAuthModal.set(true);
  }

  closeAuthModal() {
    this._showAuthModal.set(false);
  }

  requestUpload() {
    this._triggerUpload.update((n) => n + 1);
  }
}
