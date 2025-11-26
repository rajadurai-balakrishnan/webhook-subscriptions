import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-key-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="success-dialog">
      <div class="success-icon">
        <mat-icon>check_circle</mat-icon>
      </div>

      <h2>Subscription Created Successfully!</h2>

      <p class="message">
        Your webhook subscription has been created. Store your private key in a secure location.
        You'll need it to validate webhook signatures.
      </p>

      <div class="key-section">
        <label>Your Private Key (16-digit)</label>
        <div class="key-display">
          <code>{{ data.privateKey }}</code>
          <button
            type="button"
            mat-icon-button
            (click)="copyKey()"
            [matTooltip]="copyTooltip"
            class="copy-btn"
          >
            <mat-icon>{{ copyIcon }}</mat-icon>
          </button>
        </div>
      </div>

      <div class="warning">
        <mat-icon>warning</mat-icon>
        <div class="warning-content">
          <strong>Important:</strong>
          <p>Store this key securely. You won't be able to retrieve it again. If lost, you can regenerate it from the subscription settings.</p>
        </div>
      </div>

      <div class="actions">
        <button
          type="button"
          mat-raised-button
          color="primary"
          (click)="onClose()"
          class="close-btn"
        >
          View Subscriptions
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      padding: 40px 32px;
      text-align: center;
    }

    .success-icon {
      margin-bottom: 24px;

      mat-icon {
        font-size: 60px;
        width: 60px;
        height: 60px;
        color: #4caf50;
      }
    }

    h2 {
      margin: 0 0 16px 0;
      font-size: 22px;
      color: #1a1a1a;
      font-weight: 600;
    }

    .message {
      margin: 0 0 24px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.6;
    }

    .key-section {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: left;

      label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        text-transform: uppercase;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
      }

      .key-display {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 12px;

        code {
          flex: 1;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          letter-spacing: 2px;
          color: #1a1a1a;
          font-weight: 600;
          word-break: break-all;
        }

        .copy-btn {
          color: #1976d2;
          flex-shrink: 0;
        }
      }
    }

    .warning {
      display: flex;
      gap: 12px;
      background-color: #fff3e0;
      border: 1px solid #ffe0b2;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 24px;
      text-align: left;

      mat-icon {
        color: #f57c00;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .warning-content {
        flex: 1;

        strong {
          display: block;
          color: #f57c00;
          margin-bottom: 4px;
        }

        p {
          margin: 0;
          font-size: 13px;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;

      .close-btn {
        color: white;
      }
    }

    @media (max-width: 600px) {
      .success-dialog {
        padding: 32px 20px;
      }

      h2 {
        font-size: 18px;
      }

      .key-display {
        flex-direction: column;
        align-items: flex-start;

        code {
          width: 100%;
          font-size: 14px;
        }
      }
    }
  `]
})
export class KeySuccessDialogComponent {
  copyIcon = 'content_copy';
  copyTooltip = 'Copy private key';

  constructor(
    public dialogRef: MatDialogRef<KeySuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { privateKey: string },
    private toastService: ToastService
  ) {}

  copyKey() {
    navigator.clipboard.writeText(this.data.privateKey).then(() => {
      this.copyIcon = 'check';
      this.copyTooltip = 'Copied!';
      setTimeout(() => {
        this.copyIcon = 'content_copy';
        this.copyTooltip = 'Copy private key';
      }, 2000);
      this.toastService.success('Private key copied to clipboard');
    }).catch(() => {
      this.toastService.error('Failed to copy private key');
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
