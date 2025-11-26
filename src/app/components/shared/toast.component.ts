import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, Toast } from '../../services/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        [@slideIn]
        [class]="'toast toast-' + toast.type"
      >
        <span>{{ toast.message }}</span>
        <button (click)="dismiss(toast.id)" class="close-btn">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: all;
      font-size: 14px;
      font-weight: 500;
      min-width: 300px;
      max-width: 500px;
      word-break: break-word;
    }

    .toast-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .toast-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .toast-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 24px;
      padding: 0;
      margin-left: 16px;
      line-height: 1;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .close-btn:hover {
      opacity: 1;
    }

    @media (max-width: 600px) {
      .toast-container {
        left: 10px;
        right: 10px;
        top: 10px;
      }

      .toast {
        min-width: auto;
        max-width: none;
      }
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();
  private toastMap = new Map<string, Toast>();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toast => {
        if (toast.message) {
          this.toastMap.set(toast.id, toast);
          this.updateToasts();
        } else {
          this.toastMap.delete(toast.id);
          this.updateToasts();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateToasts() {
    this.toasts = Array.from(this.toastMap.values());
  }

  dismiss(id: string) {
    this.toastService.remove(id);
  }
}
