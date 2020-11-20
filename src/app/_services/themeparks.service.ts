import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Themepark} from '../_interfaces/themepark.interface';
import {PhantasialandService} from './phantasialand/phantasialand.service';
import {ThemeparkService} from './themepark.service';
import {Country} from '../_interfaces/country.interface';
import {EuropaparkService} from './europapark/europapark.service';
import {HeidiparkService} from './heidipark/heidipark.service';
import {ParcasterixService} from './parkasterix/parcasterix.service';
import {EftelingService} from './efteling/efteling.service';
import {BellewaerdeService} from './bellewaerde/bellewaerde.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeparksService {
  private _countries: Country[] = [{
    id: 'de',
    name: 'Duitsland',
    flag_url: 'https://flagcdn.com/de.svg'
  }, {
    id: 'fr',
    name: 'Frankrijk',
    flag_url: 'https://flagcdn.com/fr.svg'
  }, {
    id: 'nl',
    name: 'Nederland',
    flag_url: 'https://flagcdn.com/nl.svg'
  }, {
    id: 'be',
    name: 'België',
    flag_url: 'https://flagcdn.com/be.svg'
  }];

  private _themeparks: Themepark[] = [];

  constructor(private httpClient: HttpClient,
              private phantasialandService: PhantasialandService,
              private europaparkService: EuropaparkService,
              private heidiparkService: HeidiparkService,
              private parcasterixService: ParcasterixService,
              private eftelingService: EftelingService,
              private bellewaerdeService: BellewaerdeService) {
    this._themeparks.push(eftelingService.getInfo(this._countries.filter(c => c.id == 'nl')[0]));
    this._themeparks.push(phantasialandService.getInfo(this._countries.filter(c => c.id == 'de')[0]));
    this._themeparks.push(parcasterixService.getInfo(this._countries.filter(c => c.id == 'fr')[0]));
    this._themeparks.push(bellewaerdeService.getInfo(this._countries.filter(c => c.id == 'be')[0]));
  }

  public getParks(): Promise<Themepark[]> {
    return Promise.resolve(this._themeparks);
  }

  public findPark(parkId: string): Promise<Themepark> {
    return Promise.resolve(this._themeparks.filter(park => park.id == parkId)[0]);
  }

  public getParkService(parkId: string): Promise<ThemeparkService> {
    return this.findPark(parkId).then(park => {
      return park.service as ThemeparkService;
    });
  }
}
