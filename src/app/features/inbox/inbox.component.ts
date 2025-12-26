import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, ComingSoonComponent],
  template: `<app-coming-soon title="Bandeja de entrada" icon="✉️" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent {}
