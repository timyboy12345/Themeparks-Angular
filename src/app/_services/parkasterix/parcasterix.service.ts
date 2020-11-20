import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {HttpClient} from '@angular/common/http';
import {ParcasterixPoi} from '../../_interfaces/parcasterix/parcasterix_poi.interface';
import {CacheService} from '../cache.service';
import {environment} from '../../../environments/environment';
import {ThemeparkOptions} from '../../_interfaces/themepark_options.interface';
import {Country} from '../../_interfaces/country.interface';
import {Themepark} from '../../_interfaces/themepark.interface';
import {WaitingTimes, WaitingTimesState} from '../../_interfaces/waitingtimes.interface';
import {ParcAsterixWaitTimeResponse} from '../../_interfaces/parcasterix/parcasterix_waittimeresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ParcasterixService extends ThemeparkService {
  private apiUrl = `${environment.SHARED_API_URL}/parcasterix`;
  private apiVersion = '1';
  private appVersion = '320';
  private device = 'android';
  private apiLang = 'en';

  public supports(): ThemeparkOptions {
    return {
      parkSupportsOpeningTimes: false,
      parkSupportsPois: true,
      parkSupportsRideAreas: false,
      parkSupportsShowTimes: false,
      parkSupportsWaitingTimes: true
    }
  }

  getInfo(country: Country): Themepark {
    return {
      id: 'parcasterix_fr',
      name: 'Parc Asterix',
      description: 'Parc Astérix is een Frans attractiepark in Plailly, ongeveer 35 km ten noorden van Parijs. Het is gebaseerd op de stripverhalen van Asterix en Obelix van Albert Uderzo en René Goscinny.',
      service: this,
      country: country,
      enabled: true,
      image_url: 'https://www.parcasterix.fr/sites/default/files/images/attractions/teaser/aerolaf_sylvain_cambon_2018-2023_32.jpg'
    }
  }

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  private getParcAsterixAttractions(): Promise<ParcasterixPoi[]> {
    return this.cacheService.remember<ParcasterixPoi[]>('parcasterix_pois', environment.CACHE_POIS_SECONDS, () => {
      const url = `${this.apiUrl}/pois`;
      return this.httpClient.get<any>(url).toPromise().then((value: any) => {
        return value.result.attractions;
      });
    });
  }

  public getPois(): Promise<Poi[]> {
    return this.getParcAsterixAttractions().then((pois) => {
      return pois.map(poi => {
        const p: Poi = {
          id: poi.code.toString(),
          title: poi.title,
          description: poi.description,
          category: PoiCategory.ATTRACTION,
          original_category: '',
          image_url: poi.slider_images[0],
          original: poi,
          featured: poi.best,
          photoPoint: poi.point_photo,
          images: poi.slider_images
        };

        return p;
      });
    });
  }

  private getParcAsterixWaitingTimes(): Promise<ParcAsterixWaitTimeResponse> {
    // return this.cacheService.remember<ParcasterixPoi[]>('parcasterix_pois', environment.CACHE_POIS_SECONDS, () => {
      const url = `${this.apiUrl}/waittimes`;
      return this.httpClient.get<any>(url).toPromise();
    // });
  }

  public getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getParcAsterixWaitingTimes().then(value => {
      console.log(value);
      return value.latency.latency.map((wt) => {
        return {
          original: wt,
          ride_id: wt.attractionid,
          state: WaitingTimesState.CLOSED,
          wait: 0
        }
      })
    })
  }
}
