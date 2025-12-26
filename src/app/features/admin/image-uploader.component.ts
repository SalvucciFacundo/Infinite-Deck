import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckUploadService } from '../../core/services/deck-upload.service';

@Component({
  selector: 'app-image-uploader',
  imports: [CommonModule],
  template: `
    <div class="uploader-container">
      <button
        class="sync-btn"
        (click)="onSync()"
        [class.loading]="isSyncing()"
        [disabled]="isSyncing() || isUploading()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
        {{ isSyncing() ? 'Sincronizando...' : 'Sincronizar Storage' }}
      </button>

      <button
        class="sync-btn"
        (click)="onReorganize()"
        [class.loading]="isReorganizing()"
        [disabled]="isSyncing() || isUploading() || isReorganizing()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 3h7v7H3z" />
          <path d="M14 3h7v7h-7z" />
          <path d="M14 14h7v7h-7z" />
          <path d="M3 14h7v7H3z" />
        </svg>
        {{ isReorganizing() ? 'Organizando...' : 'Organizar Canvas' }}
      </button>

      <label class="upload-btn" [class.loading]="isUploading()">
        <input
          type="file"
          (change)="onFileSelected($event)"
          accept="image/*"
          [disabled]="isSyncing() || isUploading()"
        />
        @if (isUploading()) {
        <span>Subiendo...</span>
        } @else {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        Subir Obra }
      </label>
    </div>
  `,
  styles: `
    .uploader-container {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    
    .upload-btn, .sync-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      border-radius: 40px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.85rem;
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.2s ease;
      white-space: nowrap;
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      input {
        display: none;
      }
    }

    .sync-btn {
      // Specific style if needed
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent {
  private uploadService = inject(DeckUploadService);
  isUploading = signal(false);
  isSyncing = signal(false);
  isReorganizing = signal(false);

  async onSync() {
    this.isSyncing.set(true);
    try {
      await this.uploadService.syncExistingImages();
    } finally {
      this.isSyncing.set(false);
    }
  }

  async onReorganize() {
    if (!confirm('¿Seguro que quieres reorganizar todo el canvas? Esto moverá todas las imágenes.'))
      return;
    this.isReorganizing.set(true);
    try {
      await this.uploadService.reorganizeCanvas();
    } finally {
      this.isReorganizing.set(false);
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      try {
        await this.uploadService.uploadImage(file);
      } finally {
        this.isUploading.set(false);
      }
    }
  }
}
