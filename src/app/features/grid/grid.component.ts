import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckStateService } from '../../core/services/deck-state.service';
import { ProgressiveImageComponent } from '../../shared/components/progressive-image/progressive-image.component';

@Component({
  selector: 'app-grid',
  imports: [CommonModule, ProgressiveImageComponent],
  template: `
    <div class="bento-grid">
      @for (img of images(); track img.id; let i = $index) {
      <div class="bento-item" [style.grid-row-end]="'span ' + getSpan(img.aspectRatio)">
        <app-progressive-image
          [id]="img.id"
          [url]="img.url"
          [alt]="img.title || ''"
          [blurHash]="img.blurHash"
          [aspectRatio]="img.aspectRatio"
          [priority]="i < 5"
          [likeCount]="img.likeCount || 0"
          [commentCount]="img.commentCount || 0"
          [likedBy]="img.likedBy || []"
        ></app-progressive-image>
      </div>
      }
    </div>
  `,
  styles: `
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      grid-auto-rows: 10px;
      gap: var(--bento-gap);
      padding: var(--spacing-md);
      overflow-y: auto;
      height: 100%;
      background: var(--color-bg);
    }
    
    .bento-item {
      position: relative;
      border-radius: var(--bento-radius);
      overflow: hidden;
      background: var(--color-surface);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  private state = inject(DeckStateService);
  images = this.state.images;

  getSpan(aspectRatio: number): number {
    // Basic masonry logic: calculate grid rows based on aspect ratio
    // Assuming base row height is 10px
    const baseHeight = 20; // units
    return Math.round(baseHeight / aspectRatio);
  }
}
