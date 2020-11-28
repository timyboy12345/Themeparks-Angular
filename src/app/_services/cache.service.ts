import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() {
  }

  public save(key: string, item: object, seconds: number): Promise<boolean> {
    sessionStorage.setItem(key, JSON.stringify(item));

    const now = Math.round(new Date().getTime() / 1000);
    sessionStorage.setItem(`${key}_time`, (seconds + now).toString());

    return Promise.resolve(true);
  }

  public get(key: string): any {
    const now = Math.round(new Date().getTime() / 1000);
    const deadline = parseFloat(sessionStorage.getItem(`${key}_time`) as string);

    if (!deadline || now > deadline) {
      return null;
    }

    return JSON.parse(sessionStorage.getItem(key) as string);
  }

  public async remember<T>(key: string, seconds: number, callback: any): Promise<T> {
    const result = this.get(key);

    if (result) {
      return Promise.resolve(result);
    } else {
      const callbackResult = await callback();
      this.save(key, callbackResult, seconds);
      return callbackResult;
    }
  }
}
