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
  }];

  private _oldThemeparks: Themepark[] = [{
    id: 'europapark_de',
    name: 'Europapark',
    description: 'Duitslands grootste pretpark. Meer dan 100 attracties, shows en achtbanen! Het ideale park voor een vakantie met de familie.',
    service: this.europaparkService,
    country: this._countries.filter(c => c.id == 'de')[0],
    enabled: false,
  }, {
    id: 'heidipark_de',
    name: 'Heide Park',
    description: 'Heide-Park Resort is een attractiepark, gelegen bij Soltau in het Duitse Nedersaksen. Het is qua oppervlakte het tweede grootste pretpark van Duitsland.',
    service: this.heidiparkService,
    country: this._countries.filter(c => c.id == 'de')[0],
    enabled: false,
  }, {
    id: 'parcasterix_fr',
    name: 'Parc Asterix',
    description: 'Parc Astérix is een Frans attractiepark in Plailly, ongeveer 35 km ten noorden van Parijs. Het is gebaseerd op de stripverhalen van Asterix en Obelix van Albert Uderzo en René Goscinny.',
    service: this.parcasterixService,
    country: this._countries.filter(c => c.id == 'fr')[0],
    enabled: true,
    image_url: 'https://www.parcasterix.fr/sites/default/files/images/attractions/teaser/aerolaf_sylvain_cambon_2018-2023_32.jpg'
  }];

  private _themeparks: Themepark[] = [];

  constructor(private httpClient: HttpClient,
              private phantasialandService: PhantasialandService,
              private europaparkService: EuropaparkService,
              private heidiparkService: HeidiparkService,
              private parcasterixService: ParcasterixService,
              private eftelingService: EftelingService) {
    this._themeparks.push(eftelingService.getInfo(this._countries.filter(c => c.id == 'nl')[0]));
    this._themeparks.push(phantasialandService.getInfo(this._countries.filter(c => c.id == 'de')[0]));
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
