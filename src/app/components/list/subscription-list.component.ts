import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { SubscriptionService } from '../../services/subscription.service';
import { PrivateKeyGeneratorService } from '../../services/private-key-generator.service';
import { ToastService } from '../../services/toast.service';
import { Subscription, AuthType, EventType } from '../../models/subscription.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog.component';
import { EmptyStateComponent } from '../shared/empty-state.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';

@Component({
  selector: 'app-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="list-container">
      <div class="list-header">
        <h2>Subscriptions</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="onCreateNew()"
          class="create-btn"
        >
          <mat-icon>add</mat-icon>
          New Subscription
        </button>
      </div>

      <div class="search-container">
        <mat-form-field>
          <mat-label>Search subscriptions</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            placeholder="Search by client name or webhook URL"
          />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <app-loading-spinner
        [isLoading]="isLoading"
        message="Loading subscriptions..."
      ></app-loading-spinner>

      <app-empty-state
        *ngIf="!isLoading && filteredSubscriptions.length === 0"
        title="No subscriptions found"
        message="Create your first webhook subscription to get started."
        actionLabel="Create Subscription"
        [actionCallback]="onCreateNew.bind(this)"
      ></app-empty-state>

      <div *ngIf="!isLoading && filteredSubscriptions.length > 0" class="table-wrapper">
        <table class="subscriptions-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Webhook URL</th>
              <th>Auth Type</th>
              <th>Events</th>
              <th>Private Key</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let subscription of filteredSubscriptions" [@fadeIn]>
              <td class="client-name">{{ subscription.clientName }}</td>
              <td class="url-cell">
                <span [matTooltip]="subscription.webhookUrl" matTooltipPosition="above">
                  {{ subscription.webhookUrl | slice:0:50 }}{{ subscription.webhookUrl.length > 50 ? '...' : '' }}
                </span>
              </td>
              <td>
                <span class="auth-badge" [class.basic]="subscription.authType === AuthType.BASIC_AUTH">
                  {{ subscription.authType === AuthType.BASIC_AUTH ? 'Basic Auth' : 'OAuth' }}
                </span>
              </td>
              <td>
                <div class="event-tags">
                  <span *ngIf="subscription.eventTypes.includes(EventType.BOTH)" class="event-badge all">All Events</span>
                  <span *ngIf="!subscription.eventTypes.includes(EventType.BOTH) && subscription.eventTypes.includes(EventType.GENERAL_REPORT)" class="event-badge">General Report</span>
                  <span *ngIf="!subscription.eventTypes.includes(EventType.BOTH) && subscription.eventTypes.includes(EventType.SPECIAL_REPORT)" class="event-badge">Special Report</span>
                </div>
              </td>
              <td class="key-cell">
                <div class="key-display">
                  <span class="masked-key">{{ maskKey(subscription.privateKey) }}</span>
                  <button
                    mat-icon-button
                    (click)="copyPrivateKey(subscription.privateKey)"
                    matTooltip="Copy private key"
                    class="copy-btn"
                  >
                    <mat-icon>content_copy</mat-icon>
                  </button>
                </div>
              </td>
              <td class="actions-cell">
                <button
                  mat-icon-button
                  (click)="onEdit(subscription)"
                  matTooltip="Edit subscription"
                  class="edit-btn"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="onDelete(subscription)"
                  matTooltip="Delete subscription"
                  class="delete-btn"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      padding: 32px 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;

      h2 {
        margin: 0;
        font-size: 28px;
        color: #1a1a1a;
        font-weight: 600;
      }

      .create-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        color: white !important;
      }
    }

    .search-container {
      margin-bottom: 24px;

      mat-form-field {
        width: 100%;
        max-width: 400px;
      }
    }

    .table-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow-x: auto;
    }

    .subscriptions-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;

      thead {
        background-color: #f8f9fa;
        border-bottom: 2px solid #e0e0e0;

        th {
          padding: 16px;
          text-align: left;
          color: #333;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 13px;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;

          &:hover {
            background-color: #fafafa;
          }

          td {
            padding: 16px;
            color: #666;
            vertical-align: middle;
          }
        }
      }
    }

    .client-name {
      font-weight: 500;
      color: #1a1a1a;
    }

    .url-cell {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #1976d2;

      span {
        cursor: help;
      }
    }

    .auth-badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.basic {
        background-color: #f3e5f5;
        color: #6a1b9a;
      }
    }

    .event-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .event-badge {
        display: inline-block;
        padding: 4px 10px;
        background-color: #f0f0f0;
        color: #666;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;

        &.all {
          background-color: #fff3e0;
          color: #f57c00;
        }
      }
    }

    .key-cell {
      font-family: 'Courier New', monospace;
    }

    .key-display {
      display: flex;
      align-items: center;
      gap: 8px;

      .masked-key {
        background-color: #f0f0f0;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        letter-spacing: 1px;
        color: #333;
      }

      .copy-btn {
        color: #1976d2;
        width: 32px;
        height: 32px;
      }
    }

    .actions-cell {
      text-align: center;
    }

    .edit-btn {
      color: #1976d2;
    }

    .delete-btn {
      color: #dc3545;
    }

    @media (max-width: 768px) {
      .list-container {
        padding: 20px 16px;
      }

      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        h2 {
          font-size: 22px;
        }

        .create-btn {
          width: 100%;
          justify-content: center;
        }
      }

      .search-container mat-form-field {
        max-width: 100%;
      }

      .subscriptions-table {
        font-size: 12px;

        thead th {
          padding: 12px;
        }

        tbody td {
          padding: 12px;
        }
      }

      .url-cell {
        display: none;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SubscriptionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  searchQuery = '';
  isLoading = true;
  EventType = EventType;
  AuthType = AuthType;

  constructor(
    private subscriptionService: SubscriptionService,
    private keyGenerator: PrivateKeyGeneratorService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.subscriptionService.getAll().subscribe(subs => {
        this.subscriptions = subs;
        this.filteredSubscriptions = subs;
        this.isLoading = false;
      });
    }, 300);
  }

  onSearch(query: string) {
    if (!query.trim()) {
      this.filteredSubscriptions = this.subscriptions;
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.filteredSubscriptions = this.subscriptions.filter(sub =>
      sub.clientName.toLowerCase().includes(lowerQuery) ||
      sub.webhookUrl.toLowerCase().includes(lowerQuery)
    );
  }

  maskKey(key: string): string {
    return this.keyGenerator.maskPrivateKey(key);
  }

  copyPrivateKey(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      this.toastService.success('Private key copied to clipboard');
    }).catch(() => {
      this.toastService.error('Failed to copy private key');
    });
  }

  onCreateNew() {
    window.location.hash = '/create';
  }

  onEdit(subscription: Subscription) {
    window.location.hash = `/edit/${subscription.id}`;
  }

  onDelete(subscription: Subscription) {
    const dialogData: ConfirmDialogData = {
      title: 'Delete Subscription',
      message: 'Are you sure you want to delete this subscription? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
      details: [
        { label: 'Client Name', value: subscription.clientName },
        { label: 'Webhook URL', value: subscription.webhookUrl }
      ]
    };

    this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: false
    }).afterClosed().subscribe(result => {
      if (result) {
        this.subscriptionService.delete(subscription.id);
        this.toastService.success('Subscription deleted successfully');
      }
    });
  }
}
