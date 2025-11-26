import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionService } from '../../services/subscription.service';
import { PrivateKeyGeneratorService } from '../../services/private-key-generator.service';
import { ToastService } from '../../services/toast.service';
import { AuthType, EventType } from '../../models/subscription.model';
import { KeySuccessDialogComponent } from './key-success-dialog.component';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEditMode ? 'Edit Subscription' : 'Create New Subscription' }}</h2>
        <p class="subtitle">{{ isEditMode ? 'Update your webhook subscription details' : 'Set up a new webhook subscription to receive events' }}</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <mat-card class="form-card">
          <mat-card-content>
            <h3 class="section-title">Basic Information</h3>

            <mat-form-field class="full-width">
              <mat-label>Client Name</mat-label>
              <input matInput formControlName="clientName" placeholder="e.g., Acme Corporation" />
              <mat-error *ngIf="getError('clientName', 'required')">
                Client name is required
              </mat-error>
              <mat-error *ngIf="getError('clientName', 'minlength')">
                Client name must be at least 2 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Webhook URL</mat-label>
              <input matInput formControlName="webhookUrl" placeholder="https://example.com/webhook" />
              <mat-error *ngIf="getError('webhookUrl', 'required')">
                Webhook URL is required
              </mat-error>
              <mat-error *ngIf="getError('webhookUrl', 'pattern')">
                Please enter a valid webhook URL
              </mat-error>
            </mat-form-field>

            <h3 class="section-title">Authentication</h3>

            <mat-form-field class="full-width">
              <mat-label>Authentication Type</mat-label>
              <mat-select formControlName="authType" (selectionChange)="onAuthTypeChange()">
                <mat-option [value]="AuthType.BASIC_AUTH">Basic Auth</mat-option>
                <mat-option [value]="AuthType.OAUTH">OAuth</mat-option>
              </mat-select>
              <mat-error *ngIf="getError('authType', 'required')">
                Authentication type is required
              </mat-error>
            </mat-form-field>

            <div *ngIf="form.get('authType')?.value === AuthType.BASIC_AUTH" class="auth-fields">
              <mat-form-field class="full-width">
                <mat-label>Username</mat-label>
                <input matInput formControlName="username" placeholder="Enter username" />
                <mat-error *ngIf="getError('username', 'required')">
                  Username is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Password</mat-label>
                <input matInput type="password" formControlName="password" placeholder="Enter password" />
                <mat-error *ngIf="getError('password', 'required')">
                  Password is required
                </mat-error>
              </mat-form-field>
            </div>

            <div *ngIf="form.get('authType')?.value === AuthType.OAUTH" class="auth-fields">
              <mat-form-field class="full-width">
                <mat-label>Client ID</mat-label>
                <input matInput formControlName="clientId" placeholder="OAuth client ID" />
                <mat-error *ngIf="getError('clientId', 'required')">
                  Client ID is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Client Secret</mat-label>
                <input matInput type="password" formControlName="clientSecret" placeholder="OAuth client secret" />
                <mat-error *ngIf="getError('clientSecret', 'required')">
                  Client secret is required
                </mat-error>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Token Endpoint</mat-label>
                <input matInput formControlName="tokenEndpoint" placeholder="https://auth.example.com/token" />
                <mat-error *ngIf="getError('tokenEndpoint', 'required')">
                  Token endpoint is required
                </mat-error>
                <mat-error *ngIf="getError('tokenEndpoint', 'pattern')">
                  Please enter a valid token endpoint URL
                </mat-error>
              </mat-form-field>
            </div>

            <h3 class="section-title">Event Subscription</h3>

            <fieldset class="event-fieldset">
              <legend>Select events to receive:</legend>
              <div class="checkbox-group">
                <mat-checkbox
                  [checked]="form.get('eventTypes')?.value?.includes(EventType.GENERAL_REPORT)"
                  (change)="onEventTypeChange(EventType.GENERAL_REPORT)"
                >
                  General Report
                  <span class="description">Receive general system reports</span>
                </mat-checkbox>

                <mat-checkbox
                  [checked]="form.get('eventTypes')?.value?.includes(EventType.SPECIAL_REPORT)"
                  (change)="onEventTypeChange(EventType.SPECIAL_REPORT)"
                >
                  Special Report
                  <span class="description">Receive special event reports</span>
                </mat-checkbox>

                <mat-checkbox
                  [checked]="form.get('eventTypes')?.value?.includes(EventType.BOTH)"
                  (change)="onEventTypeChange(EventType.BOTH)"
                >
                  Both (All Events)
                  <span class="description">Receive all event types</span>
                </mat-checkbox>
              </div>
              <mat-error *ngIf="getError('eventTypes', 'required')" class="event-error">
                At least one event type must be selected
              </mat-error>
            </fieldset>
          </mat-card-content>
        </mat-card>

        <div class="form-actions">
          <button
            type="button"
            mat-stroked-button
            (click)="onCancel()"
            class="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            mat-stroked-button
            (click)="onReset()"
            class="reset-btn"
          >
            Reset
          </button>
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="form.invalid"
            class="submit-btn"
          >
            {{ isEditMode ? 'Update Subscription' : 'Create Subscription' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .form-header {
      margin-bottom: 32px;

      h2 {
        margin: 0 0 8px 0;
        font-size: 28px;
        color: #1a1a1a;
        font-weight: 600;
      }

      .subtitle {
        margin: 0;
        color: #999;
        font-size: 14px;
      }
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

      ::ng-deep .mat-mdc-card-content {
        padding: 24px;
      }
    }

    .section-title {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;

      &:first-child {
        margin-top: 0;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    .auth-fields {
      padding: 16px;
      background-color: #f8f9fa;
      border-left: 4px solid #1976d2;
      border-radius: 4px;
      margin-bottom: 16px;
      animation: slideDown 0.3s ease-out;

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      mat-form-field {
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    .event-fieldset {
      border: none;
      padding: 0;
      margin: 0;

      legend {
        padding: 0;
        margin-bottom: 12px;
        font-size: 13px;
        font-weight: 600;
        color: #333;
      }

      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      ::ng-deep .mat-mdc-checkbox {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .description {
        display: block;
        font-size: 12px;
        color: #999;
        margin-top: 2px;
      }

      .event-error {
        color: #d32f2f;
        font-size: 12px;
        margin-top: 8px;
        display: block;
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 32px;

      button {
        min-width: 120px;
      }

      .submit-btn {
        color: white;
      }

      .cancel-btn,
      .reset-btn {
        color: #666;
      }
    }

    @media (max-width: 600px) {
      .form-container {
        padding: 20px 16px;
      }

      .form-header h2 {
        font-size: 22px;
      }

      .form-actions {
        flex-wrap: wrap;

        button {
          flex: 1;
          min-width: 100px;
        }
      }
    }
  `]
})
export class SubscriptionFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  subscriptionId: string | null = null;
  AuthType = AuthType;
  EventType = EventType;

  constructor(
    private fb: FormBuilder,
    private subscriptionService: SubscriptionService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    const hash = window.location.hash;
    if (hash.includes('/edit/')) {
      this.subscriptionId = hash.split('/').pop() || null;
      if (this.subscriptionId) {
        this.isEditMode = true;
        const subscription = this.subscriptionService.getById(this.subscriptionId);
        if (subscription) {
          this.populateForm(subscription);
        } else {
          this.toastService.error('Subscription not found');
          window.location.hash = '/';
        }
      }
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      webhookUrl: ['', [
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/)
      ]],
      authType: [AuthType.BASIC_AUTH, Validators.required],
      username: [''],
      password: [''],
      clientId: [''],
      clientSecret: [''],
      tokenEndpoint: [''],
      eventTypes: [[], Validators.required]
    });
  }

  private populateForm(subscription: any) {
    const authCreds = subscription.authCredentials;
    this.form.patchValue({
      clientName: subscription.clientName,
      webhookUrl: subscription.webhookUrl,
      authType: subscription.authType,
      eventTypes: subscription.eventTypes
    });

    if (subscription.authType === AuthType.BASIC_AUTH) {
      this.form.patchValue({
        username: authCreds.username,
        password: authCreds.password
      });
    } else {
      this.form.patchValue({
        clientId: authCreds.clientId,
        clientSecret: authCreds.clientSecret,
        tokenEndpoint: authCreds.tokenEndpoint
      });
    }

    this.updateAuthValidators();
  }

  onAuthTypeChange() {
    this.updateAuthValidators();
  }

  private updateAuthValidators() {
    const authType = this.form.get('authType')?.value;
    const usernameCtrl = this.form.get('username');
    const passwordCtrl = this.form.get('password');
    const clientIdCtrl = this.form.get('clientId');
    const clientSecretCtrl = this.form.get('clientSecret');
    const tokenEndpointCtrl = this.form.get('tokenEndpoint');

    if (authType === AuthType.BASIC_AUTH) {
      usernameCtrl?.setValidators([Validators.required]);
      passwordCtrl?.setValidators([Validators.required]);
      clientIdCtrl?.clearValidators();
      clientSecretCtrl?.clearValidators();
      tokenEndpointCtrl?.clearValidators();
    } else {
      usernameCtrl?.clearValidators();
      passwordCtrl?.clearValidators();
      clientIdCtrl?.setValidators([Validators.required]);
      clientSecretCtrl?.setValidators([Validators.required]);
      tokenEndpointCtrl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
    }

    usernameCtrl?.updateValueAndValidity({ emitEvent: false });
    passwordCtrl?.updateValueAndValidity({ emitEvent: false });
    clientIdCtrl?.updateValueAndValidity({ emitEvent: false });
    clientSecretCtrl?.updateValueAndValidity({ emitEvent: false });
    tokenEndpointCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  onEventTypeChange(eventType: EventType) {
    const eventTypes = this.form.get('eventTypes')?.value || [];
    const newEventTypes = [...eventTypes];

    if (eventType === EventType.BOTH) {
      if (newEventTypes.includes(EventType.BOTH)) {
        newEventTypes.length = 0;
      } else {
        newEventTypes.length = 0;
        newEventTypes.push(EventType.BOTH);
      }
    } else {
      const bothIndex = newEventTypes.indexOf(EventType.BOTH);
      if (bothIndex > -1) {
        newEventTypes.splice(bothIndex, 1);
      }

      const index = newEventTypes.indexOf(eventType);
      if (index > -1) {
        newEventTypes.splice(index, 1);
      } else {
        newEventTypes.push(eventType);
      }
    }

    this.form.get('eventTypes')?.setValue(newEventTypes);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.getFormData();

    if (this.isEditMode && this.subscriptionId) {
      this.subscriptionService.update(this.subscriptionId, formData);
      this.toastService.success('Subscription updated successfully');
      window.location.hash = '/';
    } else {
      const subscription = this.subscriptionService.create(formData);
      this.showSuccessDialog(subscription.privateKey);
    }
  }

  private getFormData() {
    const formValue = this.form.value;
    const authType = formValue.authType;

    let authCredentials;
    if (authType === AuthType.BASIC_AUTH) {
      authCredentials = {
        username: formValue.username,
        password: formValue.password
      };
    } else {
      authCredentials = {
        clientId: formValue.clientId,
        clientSecret: formValue.clientSecret,
        tokenEndpoint: formValue.tokenEndpoint
      };
    }

    return {
      clientName: formValue.clientName,
      webhookUrl: formValue.webhookUrl,
      authType,
      authCredentials,
      eventTypes: formValue.eventTypes
    };
  }

  private showSuccessDialog(privateKey: string) {
    this.dialog.open(KeySuccessDialogComponent, {
      data: { privateKey },
      width: '500px',
      disableClose: true
    }).afterClosed().subscribe(() => {
      window.location.hash = '/';
    });
  }

  onCancel() {
    window.location.hash = '/';
  }

  onReset() {
    this.form.reset({
      authType: AuthType.BASIC_AUTH,
      eventTypes: []
    });
  }

  getError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}
