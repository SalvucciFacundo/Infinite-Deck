import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule, ComingSoonComponent],
  template: `<app-coming-soon title="Comunidades" icon="👥" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesComponent {}
