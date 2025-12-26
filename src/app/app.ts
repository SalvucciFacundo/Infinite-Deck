import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { DeckStateService } from './core/services/deck-state.service';
import { UiService } from './core/services/ui.service';
import { ImageUploaderComponent } from './features/admin/image-uploader.component';
import { ArtModalComponent } from './shared/components/art-modal/art-modal.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    ReactiveFormsModule,
    ImageUploaderComponent,
    ArtModalComponent,
    SidebarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly state = inject(DeckStateService);
  protected readonly ui = inject(UiService);
  private fb = inject(FormBuilder);

  protected readonly title = signal('Infinite-Deck');
  protected isRegistering = signal(false);
  protected showAuthModal = this.ui.showAuthModal;

  protected authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    displayName: [''],
  });

  async onSubmit() {
    if (this.authForm.invalid) return;

    const { email, password, displayName } = this.authForm.value;

    try {
      if (this.isRegistering()) {
        await this.auth.register(email!, password!, displayName!);
      } else {
        await this.auth.login(email!, password!);
      }
      this.ui.closeAuthModal();
      this.authForm.reset();
    } catch (e) {
      alert('Error en la autenticación: ' + e);
    }
  }

  toggleAuthMode() {
    this.isRegistering.update((v) => !v);
  }
}
