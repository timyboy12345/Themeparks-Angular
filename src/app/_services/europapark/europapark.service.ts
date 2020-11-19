import { Injectable } from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi} from '../../_interfaces/poi.interface';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EuropaparkService extends ThemeparkService {
  private apiUrl = 'http://cors-anywhere.herokuapp.com/https://api.europapark.de';
  private apiVersion = 'api-5.9';

  constructor(private httpClient: HttpClient) {
    super();
  }

  getPois(): Promise<Poi[]> {
    return this.httpClient.get<Poi[]>(`${this.apiUrl}/${this.apiVersion}/pointsofinterest`).toPromise();
  }
}
