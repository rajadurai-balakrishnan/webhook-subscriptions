import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  details?: { label: string; value: string }[];
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p class="message">{{ data.message }}</p>
        <div *ngIf="data.details && data.details.length" class="details">
          <div *ngFor="let detail of data.details" class="detail-row">
            <strong>{{ detail.label }}:</strong>
            <span>{{ detail.value }}</span>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button
          mat-button
          (click)="onCancel()"
          class="cancel-btn"
        >
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button
          mat-raised-button
          (click)="onConfirm()"
          [class.destructive]="data.isDestructive"
          class="confirm-btn"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 400px;
    }

    h2 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 20px;
    }

    .message {
      margin: 0 0 16px 0;
      color: #666;
      line-height: 1.5;
    }

    .details {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 13px;
    }

    .detail-row {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      word-break: break-word;

      &:last-child {
        margin-bottom: 0;
      }

      strong {
        color: #333;
        margin-right: 12px;
        flex-shrink: 0;
      }

      span {
        color: #666;
        text-align: right;
      }
    }

    mat-dialog-actions {
      padding: 0;
      gap: 8px;
    }

    .cancel-btn {
      color: #666;
    }

    .confirm-btn {
      color: white;
      background-color: #1976d2;

      &.destructive {
        background-color: #dc3545;
      }
    }

    @media (max-width: 600px) {
      .confirm-dialog {
        min-width: auto;
        width: 100%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
