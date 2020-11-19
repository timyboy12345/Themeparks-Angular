import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
  }

  public save(key: string, item: object, seconds: number) {
    sessionStorage.setItem(key, JSON.stringify(item));

    const now = Math.round(new Date().getTime() / 1000);
    sessionStorage.setItem(`${key}_time`, (seconds + now).toString());
  }

  public get(key: string) {
    const now = Math.round(new Date().getTime() / 1000);
    const deadline = parseFloat(<string>sessionStorage.getItem(`${key}_time`));

    if (!deadline || now > deadline) {
      return null;
    }

    return JSON.parse(<string>sessionStorage.getItem(key));
  }

  public async remember<T>(key: string, seconds: number, callback: any): Promise<T> {
    const result = this.get(key);

    if (result) {
      return Promise.resolve(result);
    } else {
      const result = await callback();
      this.save(key, result, seconds);
      return result;
    }
  }
}
