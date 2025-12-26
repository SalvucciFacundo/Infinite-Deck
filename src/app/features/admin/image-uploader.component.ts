import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckUploadService } from '../../core/services/deck-upload.service';
import { UiService } from '../../core/services/ui.service';
import { viewChild, ElementRef, effect } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  imports: [CommonModule],
  template: `
    <div class="uploader-hidden">
      <!-- Mantener los controles originales para admin si se desea, por ahora los ocultamos y usamos triggers -->
      <input
        #fileInput
        type="file"
        (change)="onFileSelected($event)"
        accept="image/*"
        style="display: none"
      />
    </div>
  `,
  styles: `
    .uploader-hidden { display: none; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploaderComponent {
  private uploadService = inject(DeckUploadService);
  private ui = inject(UiService);

  isUploading = signal(false);
  isSyncing = signal(false);
  isReorganizing = signal(false);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  constructor() {
    effect(() => {
      const trigger = this.ui.triggerUpload();
      if (trigger > 0) {
        this.fileInput()?.nativeElement.click();
      }
    });
  }

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
