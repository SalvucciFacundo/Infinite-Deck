import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-card glass">
        <header class="profile-header">
          <a routerLink="/" class="btn-back">← Volver</a>
          <h1>Mi Perfil</h1>
        </header>

        @if (auth.userProfile(); as profile) {
        <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="profile-form">
          <div class="user-info">
            <img [src]="profile.photoURL || 'assets/default-avatar.png'" class="profile-avatar" />
            <div class="user-meta">
              <h2>{{ profile.displayName }}</h2>
              <p>{{ profile.email }}</p>
              <span class="joined-date"
                >Miembro desde {{ profile.joinedAt | date : 'mediumDate' }}</span
              >
            </div>
          </div>

          <div class="form-group">
            <label>Nombre Público</label>
            <input type="text" formControlName="displayName" placeholder="Cómo te ven otros" />
          </div>

          <div class="form-group">
            <label>Biografía</label>
            <textarea
              formControlName="bio"
              placeholder="Cuéntanos algo sobre ti..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Ubicación</label>
            <input type="text" formControlName="location" placeholder="Ciudad, País" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-save" [disabled]="profileForm.pristine || isSaving()">
              {{ isSaving() ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>

          @if (saveSuccess()) {
          <p class="success-msg">¡Perfil actualizado correctamente!</p>
          }
        </form>
        } @else {
        <div class="loading-state">
          <p>Cargando perfil...</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: `
    .profile-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      background: radial-gradient(circle at top right, #1a1a2e, #0f0f1a);
    }

    .profile-card {
      width: 100%;
      max-width: 600px;
      padding: 2.5rem;
      border-radius: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      
      h1 { margin: 0; font-size: 1.75rem; }
    }

    .btn-back {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--color-primary);
    }

    .user-meta {
      h2 { margin: 0; font-size: 1.5rem; }
      p { margin: 0.25rem 0; opacity: 0.7; }
      .joined-date { font-size: 0.85rem; opacity: 0.5; }
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      label { font-size: 0.9rem; font-weight: 500; opacity: 0.8; }
      
      input, textarea {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem;
        padding: 0.8rem 1rem;
        color: white;
        font-family: inherit;
        
        &:focus {
          outline: none;
          border-color: var(--color-primary);
          background: rgba(255, 255, 255, 0.08);
        }
      }
    }

    .btn-save {
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: 2rem;
      padding: 1rem 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }
      
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .success-msg {
      color: #10b981;
      text-align: center;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);

  protected isSaving = signal(false);
  protected saveSuccess = signal(false);

  protected profileForm = this.fb.group({
    displayName: ['', Validators.required],
    bio: [''],
    location: [''],
  });

  constructor() {
    // Initializing form with current profile data
    const profile = this.auth.userProfile();
    if (profile) {
      this.profileForm.patchValue({
        displayName: profile.displayName,
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }

  async onSave() {
    const profile = this.auth.userProfile();
    if (!profile || this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.saveSuccess.set(false);

    try {
      const userDoc = doc(this.firestore, 'users', profile.uid);
      const updates = {
        displayName: this.profileForm.value.displayName || profile.displayName,
        bio: this.profileForm.value.bio || '',
        location: this.profileForm.value.location || '',
      };

      await updateDoc(userDoc, updates);

      // Update local profile signal
      this.auth.userProfile.update((v) => (v ? { ...v, ...updates } : null));

      this.saveSuccess.set(true);
      this.profileForm.markAsPristine();
    } catch (e) {
      console.error('Error updating profile:', e);
      alert('Error al guardar el perfil');
    } finally {
      this.isSaving.set(false);
    }
  }
}
