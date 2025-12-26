import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  viewChild,
  signal,
  effect,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckStateService } from '../../core/services/deck-state.service';
import { ProgressiveImageComponent } from '../../shared/components/progressive-image/progressive-image.component';

@Component({
  selector: 'app-canvas',
  imports: [CommonModule, ProgressiveImageComponent],
  template: `
    <div
      class="canvas-viewport"
      #viewport
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseUp()"
      (wheel)="onWheel($event)"
    >
      <div class="canvas-content" [style.transform]="canvasTransform()">
        @for (img of imagesWithPriority(); track img.id) {
        <div
          class="canvas-item"
          [style.left.px]="img.x"
          [style.top.px]="img.y"
          [style.width.px]="img.width"
          [style.height.px]="img.height"
        >
          <app-progressive-image
            [id]="img.id"
            [url]="img.url"
            [alt]="img.title || ''"
            [blurHash]="img.blurHash"
            [aspectRatio]="img.aspectRatio"
            [priority]="img.isPriority"
            [likeCount]="img.likeCount || 0"
            [commentCount]="img.commentCount || 0"
            [likedBy]="img.likedBy || []"
          ></app-progressive-image>
        </div>
        }
      </div>
    </div>
  `,
  styles: `
    .canvas-viewport {
      width: 100%;
      height: 100%;
      overflow: hidden;
      cursor: grab;
      position: relative;
      background: radial-gradient(circle, #1a1a20 1px, transparent 1px);
      background-size: 40px 40px;
      
      &:active {
        cursor: grabbing;
      }
    }
    .canvas-content {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 0 0;
      will-change: transform;
    }
    .canvas-item {
      position: absolute;
      background: var(--color-surface);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.05);
        z-index: 10;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CanvasComponent {
  private state = inject(DeckStateService);
  viewport = viewChild.required<ElementRef>('viewport');

  images = this.state.images;
  viewportState = this.state.viewport;

  imagesWithPriority = computed(() => {
    const allImages = this.images();
    if (allImages.length === 0) return [];

    // Map images to include their distance from center (0,0)
    const imagesWithDistance = allImages.map((img) => ({
      ...img,
      distance: Math.sqrt(Math.pow(img.x + img.width / 2, 2) + Math.pow(img.y + img.height / 2, 2)),
    }));

    // Sort by distance and take the indices of the top 10 closest
    const sortedIndices = imagesWithDistance
      .map((img, index) => ({ index, distance: img.distance }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map((item) => item.index);

    // Return images with isPriority flag
    return imagesWithDistance.map((img, index) => ({
      ...img,
      isPriority: sortedIndices.includes(index),
    }));
  });

  private isDragging = false;
  private lastMousePos = { x: 0, y: 0 };

  canvasTransform = computed(() => {
    const { x, y, zoom } = this.viewportState();
    return `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
  });

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMousePos.x;
    const dy = event.clientY - this.lastMousePos.y;

    this.state.updateViewport({
      x: this.viewportState().x + dx,
      y: this.viewportState().y + dy,
    });

    this.lastMousePos = { x: event.clientX, y: event.clientY };
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -event.deltaY;
    const newZoom = Math.min(Math.max(this.viewportState().zoom + delta * zoomSpeed, 0.1), 3);

    // Optional: Zoom towards mouse position
    this.state.updateViewport({ zoom: newZoom });
  }
}
