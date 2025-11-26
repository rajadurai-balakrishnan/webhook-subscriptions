import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/shared/header.component';
import { ToastComponent } from './components/shared/toast.component';
import { SubscriptionListComponent } from './components/list/subscription-list.component';
import { SubscriptionFormComponent } from './components/form/subscription-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ToastComponent,
    SubscriptionListComponent,
    SubscriptionFormComponent
  ],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-toast></app-toast>

      <main class="main-content">
        <app-subscription-list *ngIf="currentView === 'list'"></app-subscription-list>
        <app-subscription-form *ngIf="currentView === 'form'"></app-subscription-form>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #fafafa;
      display: flex;
      flex-direction: column;
    }

    app-header {
      flex-shrink: 0;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class AppComponent implements OnInit {
  currentView: 'list' | 'form' = 'list';

  ngOnInit() {
    this.updateViewFromHash();
    window.addEventListener('hashchange', () => this.updateViewFromHash());
  }

  private updateViewFromHash() {
    const hash = window.location.hash;
    if (hash.includes('/create') || hash.includes('/edit/')) {
      this.currentView = 'form';
    } else {
      this.currentView = 'list';
    }
  }
}
