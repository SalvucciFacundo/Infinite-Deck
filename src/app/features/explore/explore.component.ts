import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, GridComponent],
  template: `
    <div class="explore-page">
      <header class="explore-header">
        <h1>Explorar</h1>
        <p>Descubre las obras más destacadas de la comunidad</p>
      </header>

      <div class="content">
        <app-grid />
      </div>
    </div>
  `,
  styles: `
    .explore-page {
      padding: 2rem;
      min-height: 100vh;
    }
    .explore-header {
      margin-bottom: 2rem;
      max-width: 1400px;
      margin-left: auto;
      margin-right: auto;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        letter-spacing: -1px;
      }
      p {
        color: #94a3b8;
        font-size: 1.1rem;
      }
    }
    .content {
      max-width: 1400px;
      margin: 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent {}
