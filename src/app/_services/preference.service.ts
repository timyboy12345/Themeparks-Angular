import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor() {
  }

  public listType(newType?: 'list' | 'cards'): 'list' | 'cards' {
    if (newType) {
      this.setPreference('listType', newType)
    }

    const p = this.getPreference('listType');
    return p == 'list' ? 'list' : 'cards';
  }

  private getPreference(key: string): string {
    return <string> localStorage.getItem(`preference_${key}`);
  }

  private setPreference(key: string, value: string) {
    localStorage.setItem(`preference_${key}`, value);
  }
}
