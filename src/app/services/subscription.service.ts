import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription, SubscriptionFormData, AuthType, EventType } from '../models/subscription.model';
import { PrivateKeyGeneratorService } from './private-key-generator.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private subscriptions: Subscription[] = [
    {
      id: '1',
      clientName: 'Sample Client',
      webhookUrl: 'https://client.com/webhook',
      authType: AuthType.BASIC_AUTH,
      authCredentials: { username: 'user123', password: 'pass123' },
      eventTypes: [EventType.GENERAL_REPORT],
      privateKey: '9384756102837461',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  private subscriptionsSubject = new BehaviorSubject<Subscription[]>(this.subscriptions);
  public subscriptions$ = this.subscriptionsSubject.asObservable();

  constructor(private keyGenerator: PrivateKeyGeneratorService) {}

  getAll(): Observable<Subscription[]> {
    return this.subscriptions$;
  }

  getById(id: string): Subscription | undefined {
    return this.subscriptions.find(s => s.id === id);
  }

  create(formData: SubscriptionFormData): Subscription {
    const subscription: Subscription = {
      id: Date.now().toString(),
      clientName: formData.clientName,
      webhookUrl: formData.webhookUrl,
      authType: formData.authType,
      authCredentials: formData.authCredentials,
      eventTypes: formData.eventTypes,
      privateKey: this.keyGenerator.generatePrivateKey(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.subscriptions.push(subscription);
    this.subscriptionsSubject.next([...this.subscriptions]);
    return subscription;
  }

  update(id: string, formData: SubscriptionFormData): Subscription | undefined {
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      return undefined;
    }

    const existing = this.subscriptions[index];
    const updated: Subscription = {
      ...existing,
      clientName: formData.clientName,
      webhookUrl: formData.webhookUrl,
      authType: formData.authType,
      authCredentials: formData.authCredentials,
      eventTypes: formData.eventTypes,
      updatedAt: new Date()
    };

    this.subscriptions[index] = updated;
    this.subscriptionsSubject.next([...this.subscriptions]);
    return updated;
  }

  delete(id: string): boolean {
    const index = this.subscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    this.subscriptions.splice(index, 1);
    this.subscriptionsSubject.next([...this.subscriptions]);
    return true;
  }
}
