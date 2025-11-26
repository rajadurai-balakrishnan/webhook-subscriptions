import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();
  private toastId = 0;

  constructor(private ngZone: NgZone) {}

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = (this.toastId++).toString();
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };

    this.ngZone.run(() => {
      this.toastSubject.next(toast);
    });

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }

    return id;
  }

  remove(id: string) {
    this.toastSubject.next({
      id,
      message: '',
      type: 'info'
    });
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }
}
