import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Country} from '../../_interfaces/country.interface';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkOptions} from '../../_interfaces/themepark_options.interface';
import {BellewaerdeWaitTimesResponse} from '../../_interfaces/bellewaerde/bellewaerde_waittimesresponse.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {WaitingTimes, WaitingTimesState} from '../../_interfaces/waitingtimes.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {BellewaerdePoi} from '../../_interfaces/bellewaerde/bellewaerde_poi.interface';

@Injectable({
  providedIn: 'root'
})
export class BellewaerdeService extends ThemeparkService {
  private apiBase: string = environment.SHARED_API_URL;

  constructor(private httpClient: HttpClient) {
    super();
  }

  public supports(): ThemeparkOptions {
    return {
      parkSupportsWaitingTimes: true,
      parkSupportsShowTimes: false,
      parkSupportsRideAreas: false,
      parkSupportsPois: true,
      parkSupportsOpeningTimes: false
    };
  }

  getInfo(country: Country): Themepark {
    return {
      id: 'bellewaerde',
      name: 'Bellewaerde',
      description: 'Bellewaerde is een pret- en dierenpark bij Ieper, gelegen in de Belgische provincie West-Vlaanderen. Het park is in handen van het Franse Compagnie des Alpes, waar de Walibiparken ook deel van uitmaken.',
      image_url: 'https://bellewaerde.be/sites/default/files/home/2020-10/wakala-bellewaerde_0%20%281%29.jpg',
      country,
      enabled: true,
      service: this,
      options: this.supports()
    };
  }

  private getBellewaerdeWaitingTimes(): Promise<BellewaerdeWaitTimesResponse[]> {
    return this.httpClient.get<BellewaerdeWaitTimesResponse[]>(`${(this.apiBase)}/bellewaerde/waittimes`).toPromise();
  }

  getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getBellewaerdeWaitingTimes().then(value => {
      return value.map(wait => {
        return {
          ride_id: wait.id,
          wait: (wait.wait >= 0 && wait.wait <= 300) ? wait.wait : 0,
          state: wait.wait ? WaitingTimesState.OPEN : WaitingTimesState.CLOSED,
          original: wait
        };
      });
    });
  }

  private getBellewaerdePois(): Promise<BellewaerdePoi[]> {
    return this.httpClient.get<BellewaerdePoi[]>(`${environment.SHARED_API_URL}/bellewaerde/pois`).toPromise();
  }

  getPois(): Promise<Poi[]> {
    return this.getBellewaerdePois().then((rides) => {
      return rides.map(r => {
        let category = PoiCategory.UNDEFINED;

        switch (r.type) {
          case 'POI':
            category = PoiCategory.UNDEFINED;
            break;
          case 'Show':
            category = PoiCategory.SHOW;
            break;
          case 'Attractions':
            category = PoiCategory.ATTRACTION;
            break;
          case 'Resto':
            category = PoiCategory.RESTAURANT;
            break;
          default:
            break;
        }

        const p: Poi = {
          id: r.code.toString(),
          category,
          original_category: r.type,
          original: r,
          title: r.name
        };

        return p;
      });
    });
  }
}
