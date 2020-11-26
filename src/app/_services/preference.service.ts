import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor() {
  }

  public listType(newType?: 'list' | 'cards'): 'list' | 'cards' {
    if (newType) {
      this.setPreference('listType', newType);
    }

    const p = this.getPreference('listType');
    return p === 'list' ? 'list' : 'cards';
  }

  private getPreference(key: string): string {
    return localStorage.getItem(`preference_${key}`) as string;
  }

  private setPreference(key: string, value: string): void {
    localStorage.setItem(`preference_${key}`, value);
  }
}
