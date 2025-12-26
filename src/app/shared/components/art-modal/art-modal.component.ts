import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DeckStateService } from '../../../core/services/deck-state.service';
import { DeckFirestoreService } from '../../../core/services/deck-firestore.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-art-modal',
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="art-modal" (click)="$event.stopPropagation()">
        <button class="btn-close-modal" (click)="close()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-content">
          <!-- Image Section -->
          <div class="image-section">
            <img
              [ngSrc]="image()?.url || ''"
              [alt]="image()?.title"
              fill
              class="full-image"
              priority
            />
          </div>

          <!-- sidebar Info -->
          <div class="info-sidebar">
            <div class="sidebar-header">
              <h2 class="art-title">{{ image()?.title || 'Sin título' }}</h2>
              <div class="artist-pill">
                <div class="avatar-placeholder"></div>
                <span class="artist-name">Artista Anónimo</span>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
                <span>{{ image()?.likeCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  />
                </svg>
                <span>{{ image()?.commentCount || 0 }}</span>
              </div>
            </div>

            <div class="comments-container">
              <h3>Comentarios</h3>
              <div class="comments-list">
                @for (c of comments(); track c.id) {
                <div class="comment-item">
                  <img
                    [src]="c.userPhotoURL || 'assets/default-avatar.png'"
                    class="comment-avatar"
                  />
                  <div class="comment-body">
                    <span class="comment-user">{{ c.userDisplayName }}</span>
                    <p class="comment-text">{{ c.text }}</p>
                  </div>
                </div>
                } @empty {
                <p class="empty-comments">No hay comentarios aún. ¡Sé el primero!</p>
                }
              </div>
            </div>

            @if (user()) {
            <form [formGroup]="commentForm" (ngSubmit)="sendComment()" class="comment-input-area">
              <input type="text" formControlName="text" placeholder="Escribe un comentario..." />
              <button type="submit" [disabled]="commentForm.invalid || isSubmitting()">
                {{ isSubmitting() ? '...' : 'Enviar' }}
              </button>
            </form>
            } @else {
            <p class="login-prompt">Inicia sesión para comentar</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(20px);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .art-modal {
      width: 90vw;
      height: 85vh;
      max-width: 1200px;
      background: #111114;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 32px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 50px 100px rgba(0,0,0,0.8);
    }

    .btn-close-modal {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      &:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.1); }
    }

    .modal-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      height: 100%;
    }

    .image-section {
      background: #000;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      .full-image {
        object-fit: contain;
      }
    }

    .info-sidebar {
      padding: 32px;
      display: flex;
      flex-direction: column;
      border-left: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.02);
    }

    .art-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 16px 0;
      letter-spacing: -0.5px;
    }

    .artist-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.05);
      padding: 6px 16px;
      border-radius: 40px;
      width: fit-content;
      .avatar-placeholder { width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); }
      .artist-name { font-size: 0.9rem; font-weight: 600; color: #fff; }
    }

    .stats-row {
      display: flex;
      gap: 20px;
      margin: 24px 0;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #94a3b8;
        font-weight: 600;
      }
    }

    .comments-container {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      h3 { font-size: 0.9rem; text-transform: uppercase; color: #64748b; letter-spacing: 1px; margin-bottom: 16px; font-weight: 700; }
    }

    .comments-list {
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-right: 8px;
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    }

    .comment-item {
      display: flex;
      gap: 12px;
      .comment-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
      .comment-user { display: block; font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
      .comment-text { font-size: 0.9rem; color: #94a3b8; margin: 0; line-height: 1.4; }
    }

    .comment-input-area {
      margin-top: 24px;
      display: flex;
      gap: 10px;
      padding: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);

      input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        padding: 8px 12px;
        font-size: 0.95rem;
        &:focus { outline: none; }
      }

      button {
        background: #fff;
        color: #000;
        border: none;
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      }
    }

    @media (max-width: 1024px) {
      .modal-content { grid-template-columns: 1fr; grid-template-rows: 1fr 400px; }
      .info-sidebar { border-left: none; border-top: 1px solid rgba(255,255,255,0.1); }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtModalComponent {
  private state = inject(DeckStateService);
  private firestore = inject(DeckFirestoreService);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);

  image = this.state.selectedImage;
  user = this.auth.currentUser;
  isSubmitting = signal(false);

  commentForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(1)]],
  });

  comments = toSignal(
    toObservable(this.image).pipe(
      switchMap((img) => (img ? this.firestore.getComments(img.id) : of([])))
    ),
    { initialValue: [] }
  );

  close() {
    this.state.selectImage(null);
  }

  async sendComment() {
    const img = this.image();
    const user = this.user();
    if (!img || !user || this.commentForm.invalid) return;

    this.isSubmitting.set(true);
    try {
      await this.firestore.addComment({
        imageId: img.id,
        userId: user.uid,
        userDisplayName: user.displayName || user.email || 'Anónimo',
        userPhotoURL: user.photoURL || undefined,
        text: this.commentForm.value.text!,
      });
      this.commentForm.reset();
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
