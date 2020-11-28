import { Injectable } from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi} from '../../_interfaces/poi.interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeidiparkService extends ThemeparkService {
  private apiUrl = 'http://cors-anywhere.herokuapp.com/https://www.heide-park.de/api';
  private apiVersion = 'v4';

  constructor(private httpClient: HttpClient) {
    super();
  }

  getPois(): Promise<Poi[]> {
    return this.httpClient.get<Poi[]>(`${this.apiUrl}/${this.apiVersion}`).toPromise();
  }
}
