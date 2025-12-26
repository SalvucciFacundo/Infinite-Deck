import { ChangeDetectionStrategy, Component, inject, computed, OnInit } from '@angular/core';
import { DeckStateService } from '../../core/services/deck-state.service';
import { DeckFirestoreService } from '../../core/services/deck-firestore.service';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from '../canvas/canvas.component';
import { GridComponent } from '../grid/grid.component';
import { ImageUploaderComponent } from '../admin/image-uploader.component';

@Component({
  selector: 'app-hybrid-view-manager',
  imports: [CommonModule, CanvasComponent, GridComponent],
  template: `
    <main class="view-container">
      @if (viewMode() === 'canvas') {
      <app-canvas></app-canvas>
      } @else {
      <app-grid></app-grid>
      }

      <div class="controls">
        <button (click)="toggleView()">Toggle View</button>
      </div>
    </main>
  `,
  styles: `
    .view-container {
      width: 100vw;
      height: 100vh;
      position: relative;
      background: var(--color-bg);
    }
    .canvas-placeholder, .grid-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--color-text-muted);
    }
    .controls {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      
      button {
        padding: 0.75rem 1.5rem;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 2rem;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HybridViewManagerComponent {
  private state = inject(DeckStateService);
  private firestoreService = inject(DeckFirestoreService);

  // Initialize subscription via signal
  private activeImages = this.firestoreService.images;

  viewMode = this.state.viewMode;

  toggleView() {
    const current = this.viewMode();
    this.state.setViewMode(current === 'canvas' ? 'grid' : 'canvas');
  }
}
