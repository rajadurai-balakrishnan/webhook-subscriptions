import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon class="icon">inbox</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button
        *ngIf="actionLabel && actionCallback"
        mat-raised-button
        color="primary"
        (click)="onAction()"
        class="action-btn"
      >
        {{ actionLabel }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
      font-weight: 500;
    }

    p {
      margin: 0 0 24px 0;
      color: #999;
      font-size: 14px;
      max-width: 400px;
    }

    .action-btn {
      color: white;
    }

    @media (max-width: 600px) {
      .empty-state {
        padding: 40px 20px;
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No subscriptions yet';
  @Input() message = 'Create your first webhook subscription to get started.';
  @Input() actionLabel = 'Create Subscription';
  @Input() actionCallback: (() => void) | null = null;

  onAction() {
    if (this.actionCallback) {
      this.actionCallback();
    }
  }
}
