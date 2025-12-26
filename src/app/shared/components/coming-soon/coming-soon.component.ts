import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coming-soon">
      <div class="content glass">
        <span class="icon">{{ icon() }}</span>
        <h1>{{ title() }}</h1>
        <p>Estamos trabajando duro para traer esta funcionalidad. ¡Vuelve pronto!</p>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .coming-soon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .content {
      padding: 3rem;
      border-radius: 2rem;
      text-align: center;
      max-width: 500px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .icon {
      font-size: 4rem;
      filter: drop-shadow(0 0 20px var(--color-primary));
    }
    h1 {
      margin: 0;
      font-size: 2rem;
      background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      line-height: 1.6;
      margin: 0;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 1rem;
    }
    .progress {
      width: 60%;
      height: 100%;
      background: var(--color-primary);
      box-shadow: 0 0 15px var(--color-primary);
      border-radius: 3px;
      animation: progress-pulse 2s infinite ease-in-out;
    }
    @keyframes progress-pulse {
      0% { opacity: 0.6; width: 50%; }
      50% { opacity: 1; width: 70%; }
      100% { opacity: 0.6; width: 50%; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComingSoonComponent {
  title = input<string>('Próximamente');
  icon = input<string>('🚀');
}
