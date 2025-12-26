import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  effect,
  ElementRef,
  viewChild,
  inject,
  PLATFORM_ID,
  computed,
} from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { decode } from 'blurhash';

import { AuthService } from '../../../core/services/auth.service';
import { DeckFirestoreService } from '../../../core/services/deck-firestore.service';
import { DeckStateService } from '../../../core/services/deck-state.service';

@Component({
  selector: 'app-progressive-image',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="image-wrapper" [style.aspect-ratio]="aspectRatio()">
      @if (!isLoaded()) {
      <canvas #blurCanvas class="blur-placeholder"></canvas>
      }
      <img
        [ngSrc]="url()"
        [alt]="alt()"
        fill
        (load)="isLoaded.set(true)"
        [priority]="priority()"
        class="main-image"
        [class.visible]="isLoaded()"
      />

      <div class="image-overlay" (click)="onClick()">
        <div class="interaction-bar">
          <button (click)="onLike($event)" class="btn-interact" [class.is-liked]="userHasLiked()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                [attr.fill]="userHasLiked() ? 'currentColor' : 'none'"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            <span class="count">{{ likeCount() || 0 }}</span>
          </button>

          <div class="btn-interact">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              />
            </svg>
            <span class="count">{{ commentCount() || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #1a1a20;
      cursor: zoom-in;
      
      &:hover .image-overlay {
        opacity: 1;
      }
    }
    // ... blur-placeholder and main-image remains same ...
    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 16px;
      // pointer-events: none; // Removed to allow clicking the overlay
    }
    .interaction-bar {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn-interact {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 6px 14px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-size: 0.85rem;
      font-weight: 700;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      
      &.is-liked {
        color: #ff4d4d;
        background: rgba(255, 77, 77, 0.15);
        border-color: rgba(255, 77, 77, 0.3);
      }

      .count {
        color: #fff;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressiveImageComponent {
  id = input.required<string>();
  url = input.required<string>();
  blurHash = input<string>();
  alt = input<string>('');
  aspectRatio = input<number>(1);
  priority = input<boolean>(false);
  likeCount = input<number>(0);
  commentCount = input<number>(0);
  likedBy = input<string[]>([]);

  isLoaded = signal(false);
  blurCanvas = viewChild<ElementRef<HTMLCanvasElement>>('blurCanvas');

  private platformId = inject(PLATFORM_ID);
  protected auth = inject(AuthService);
  private firestoreService = inject(DeckFirestoreService);
  private state = inject(DeckStateService);

  userHasLiked = computed<boolean>(() => {
    const uid = this.auth.currentUser()?.uid;
    const likes = this.likedBy() || [];
    return !!uid && likes.includes(uid);
  });

  async onLike(event: MouseEvent) {
    event.stopPropagation();
    const userId = this.auth.currentUser()?.uid;
    if (!userId) {
      alert('Inicia sesión para dar amor a esta obra ❤️');
      return;
    }

    try {
      await this.firestoreService.toggleLike(this.id(), userId, this.userHasLiked());
    } catch (e) {
      console.error('Like error:', e);
    }
  }

  onClick() {
    this.state.selectImage({
      id: this.id(),
      url: this.url(),
      title: this.alt(),
      aspectRatio: this.aspectRatio(),
      likeCount: this.likeCount(),
      commentCount: this.commentCount(),
      likedBy: this.likedBy(),
      blurHash: this.blurHash(),
    } as any);
  }

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const hash = this.blurHash();
      const canvas = this.blurCanvas()?.nativeElement;
      if (hash && canvas) {
        this.renderBlurHash(hash, canvas);
      }
    });
  }

  private renderBlurHash(hash: string, canvas: HTMLCanvasElement) {
    const pixels = decode(hash, 32, 32);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imageData = ctx.createImageData(32, 32);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    }
  }
}
