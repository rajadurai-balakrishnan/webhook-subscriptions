import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <div class="toolbar-container">
        <div class="logo-section">
          <h1>Webhook Subscriptions</h1>
          <p>Manage your webhook integrations</p>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    ::ng-deep {
      .logo-section {
        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        p {
          margin: 4px 0 0 0;
          font-size: 13px;
          opacity: 0.9;
        }
      }

      .toolbar-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  `]
})
export class HeaderComponent {}
