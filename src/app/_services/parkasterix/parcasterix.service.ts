import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {HttpClient} from '@angular/common/http';
import {ParcasterixPoi} from '../../_interfaces/parcasterix/parcasterix_poi.interface';
import {CacheService} from '../cache.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcasterixService extends ThemeparkService {
  private apiUrl = 'http://cors-anywhere.herokuapp.com/https://www.parcasterix.fr/webservices/api';
  private apiVersion = '1';
  private appVersion = '320';
  private device = 'android';
  private apiLang = 'en';

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  private getParcAsterixAttractions(): Promise<ParcasterixPoi[]> {
    return this.cacheService.remember<ParcasterixPoi[]>('parcasterix_pois', environment.CACHE_POIS_SECONDS, () => {
      const url = `${this.apiUrl}/attractions.json?device=${this.device}&version=${this.appVersion}&lang=${this.apiLang}&apiversion=${this.apiVersion}`;
      return this.httpClient.get<any>(url).toPromise().then((value: any) => {
        return value.result.attractions;
      });
    });
  }

  getPois(): Promise<Poi[]> {
    return this.getParcAsterixAttractions().then((pois) => {
      return pois.map(poi => {
        const p: Poi = {
          id: poi.mapid.toString(),
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
}
