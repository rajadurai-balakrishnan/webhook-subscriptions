import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrivateKeyGeneratorService {
  generatePrivateKey(): string {
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += Math.floor(Math.random() * 10);
    }
    return key;
  }

  maskPrivateKey(key: string): string {
    if (key.length < 4) {
      return '*'.repeat(key.length);
    }
    return '*'.repeat(key.length - 4) + key.slice(-4);
  }
}
