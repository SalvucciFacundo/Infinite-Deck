import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UiService } from '../../../core/services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar">
      <div class="sidebar-top">
        <a routerLink="/" class="logo">
          <span class="logo-icon">∞</span>
          <span class="logo-text">Deck</span>
        </a>
      </div>

      <div class="nav-group">
        @for (item of menuItems; track item.label) {
        <a
          [routerLink]="item.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
        >
          <span class="icon">
            @switch (item.label) { @case ('Inicio') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            } @case ('Explorar') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            } @case ('Comunidades') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            } @case ('Actividad') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            } @case ('Mensajes') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            } @case ('Bandeja de entrada') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path
                d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
              />
            </svg>
            } @case ('Perfil') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            } @case ('Configuración') {
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
            } }
          </span>
          <span class="label">{{ item.label }}</span>
          @if (item.badge) {
          <span class="badge" [class.badge-primary]="item.badgeColor === 'primary'">{{
            item.badge
          }}</span>
          }
        </a>
        }
      </div>

      <div class="sidebar-footer">
        @if (auth.currentUser(); as user) {
        <div class="user-profile-sidebar">
          <img [src]="user.photoURL || 'assets/default-avatar.png'" class="avatar-mini" />
          <div class="user-meta">
            <span class="name">{{ user.displayName || user.email }}</span>
            <button (click)="auth.logout()" class="btn-logout-sidebar">Cerrar sesión</button>
          </div>
        </div>

        <button class="btn-premium">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          ¡Hazte prémium!
        </button>
        <button class="btn-create" (click)="ui.requestUpload()">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear
        </button>
        } @else {
        <button class="btn-create" (click)="ui.openAuthModal()">Entrar</button>
        }
      </div>
    </nav>
  `,
  styles: `
    .sidebar {
      width: 240px;
      height: 100vh;
      background: rgba(10, 10, 12, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      padding: 24px 12px;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }

    .sidebar-top {
      padding: 0 12px 32px;
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: #fff;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -1px;
        .logo-icon {
          background: var(--color-primary);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 1.2rem;
        }
      }
    }

    .nav-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
      }

      &.active {
        background: rgba(99, 102, 241, 0.1);
        color: var(--color-primary);
        .icon { color: var(--color-primary); }
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: color 0.2s;
      }

      .label {
        font-size: 0.95rem;
      }

      .badge {
        margin-left: auto;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        &.badge-primary {
          background: #00a8ff;
        }
      }
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .btn-premium {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 12px;
      border-radius: 40px;
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-1px); }
    }

    .btn-create {
      background: #00a8ff;
      color: #fff;
      border: none;
      padding: 12px;
      border-radius: 40px;
      font-weight: 800;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(0, 168, 255, 0.3);
      &:hover { background: #0097e6; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 168, 255, 0.4); }
    }

    .user-profile-sidebar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      margin-bottom: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);

      .avatar-mini {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid rgba(255, 255, 255, 0.1);
      }

      .user-meta {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .name {
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .btn-logout-sidebar {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 0.75rem;
          padding: 0;
          text-align: left;
          cursor: pointer;
          &:hover { color: #ff4d4d; text-decoration: underline; }
        }
      }
    }

    @media (max-width: 1024px) {
      .sidebar {
        width: 80px;
        padding: 24px 8px;
        .label, .logo-text, .btn-premium, .btn-create, .badge { display: none; }
        .logo { justify-content: center; }
        .nav-item { justify-content: center; padding: 16px; }
        .btn-premium, .btn-create { 
          width: 48px; height: 48px; border-radius: 50%; padding: 0;
          display: flex;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  auth = inject(AuthService);
  ui = inject(UiService);

  menuItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Explorar', path: '/explorar' },
    { label: 'Comunidades', path: '/comunidades' },
    { label: 'Actividad', path: '/actividad', badge: '6', badgeColor: 'primary' },
    { label: 'Mensajes', path: '/mensajes' },
    { label: 'Bandeja de entrada', path: '/inbox' },
    { label: 'Perfil', path: '/perfil' },
    { label: 'Configuración', path: '/config' },
  ];
}
