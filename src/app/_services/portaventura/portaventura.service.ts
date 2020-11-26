import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Country} from '../../_interfaces/country.interface';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkOptions} from '../../_interfaces/themepark_options.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PortaVenturaPoi} from '../../_interfaces/portaventura/portaventura_poi.interface';
import {WaitingTimes, WaitingTimesState} from '../../_interfaces/waitingtimes.interface';
import {CacheService} from '../cache.service';
import {OpeningTimes} from '../../_interfaces/openingtimes.interface';
import {PortaVenturaOpeningTimes} from '../../_interfaces/portaventura/portaventura_openingtimes.interface';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PortaVenturaService extends ThemeparkService {
  getInfo(country: Country): Themepark {
    return {
      id: 'portventura_world',
      name: 'Portaventura World',
      description: 'PortAventura World is een Spaans resort met een oppervlakte van 119 hectare gelegen in Salou en Vila-seca (Catalonië) bestaand uit onder andere diverse hotels, twee attractieparken, een waterpark, een congrescentrum en een RV park.',
      image_url: 'https://static.ticketbar.eu/_1980x1320_/barcelona/classificaties/attractions/portaventura-park/aventura-1-1536224279.jpg',
      service: this,
      enabled: true,
      country,
      options: this.supports()
    };
  }

  supports(): ThemeparkOptions {
    return {
      parkSupportsRestaurantOpeningTimes: false,
      parkSupportsShows: false,
      parkSupportsOpeningTimes: true,
      parkSupportsPois: true,
      parkSupportsRideAreas: true,
      parkSupportsShowTimes: false,
      parkSupportsWaitingTimes: true,
    };
  }

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  private getPortaVenturaAttractions(): Promise<PortaVenturaPoi[]> {
    return this.cacheService.remember<PortaVenturaPoi[]>('portaventura_attractions', environment.CACHE_POIS_SECONDS, () => {
      return this.httpClient.get<PortaVenturaPoi[]>(`${environment.SHARED_API_URL}/portaventura/attractions`).toPromise();
    });
  }

  private getPortaVenturaRestaurants(): Promise<PortaVenturaPoi[]> {
    return this.cacheService.remember<PortaVenturaPoi[]>('portaventura_restaurants', environment.CACHE_POIS_SECONDS, () => {
      return this.httpClient.get<PortaVenturaPoi[]>(`${environment.SHARED_API_URL}/portaventura/restaurants`).toPromise();
    });
  }

  private getPortaVenturaPois(): Promise<PortaVenturaPoi[]> {
    return Promise.all([
      this.getPortaVenturaAttractions(),
      this.getPortaVenturaRestaurants(),
    ]).then((arrayOfArrays) => {
      return arrayOfArrays[0].concat(arrayOfArrays[1]);
    });
  }

  private getPortaVenturaWaitTimes(): Promise<PortaVenturaPoi[]> {
    return this.cacheService.remember<PortaVenturaPoi[]>('portaventura_waittimes', environment.CACHE_WAITINGTIMES_SECONDS, () => {
      return this.httpClient.get<PortaVenturaPoi[]>(`${environment.SHARED_API_URL}/portaventura/attractions`).toPromise();
    });
  }

  private getPortaVenturaOpeningTimes(): Promise<PortaVenturaOpeningTimes> {
    return this.cacheService.remember<PortaVenturaOpeningTimes>('portaventura_openingtimes', environment.CACHE_OPENINGTIMES_SECONDS, () => {
      return this.httpClient.get<PortaVenturaOpeningTimes>(`${environment.SHARED_API_URL}/portaventura/openingtimes`).toPromise();
    });
  }

  getPois(): Promise<Poi[]> {
    return this.getPortaVenturaPois().then(pois => {
      return pois.map(poi => {
        let category = PoiCategory.UNDEFINED;

        switch (poi.tipo) {
          case 'atraccion':
            category = PoiCategory.ATTRACTION;
            break;
          case 'restaurante':
            category = PoiCategory.RESTAURANT;
            break;
          default:
            break;
        }

        return {
          id: poi.id.toString(),
          title: poi.titulo,
          description: poi.descripcion,
          category,
          original_category: poi.tipo,
          original: poi,
          image_url: poi.logo,
          area: poi.text_zona
        };
      });
    });
  }

  getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getPortaVenturaWaitTimes().then(pois => {
      return pois.map(poi => {
        return {
          ride_id: poi.id.toString(),
          state: poi.tiempo_espera >= 0 ? WaitingTimesState.OPEN : WaitingTimesState.CLOSED,
          wait: poi.tiempo_espera,
          original: poi.tiempo_espera
        };
      });
    });
  }

  getOpeningTimesOfDay(year: number, month: number, day: number): Promise<OpeningTimes> {
    return this.getOpeningTimesOfMonth(year, month).then(openingTimes => {
      return openingTimes.filter(date => date.date === `${year}-${month}-${day}`)[0];
    });
  }

  getOpeningTimesOfMonth(year: number, month: number): Promise<OpeningTimes[]> {
    return this.getPortaVenturaOpeningTimes().then(openingTimes => {
      return openingTimes.result.data.allCalendarHorario.edges[0].node.calendarTiming.map(date => {
        const m = moment(date.date_from);

        return {
          date: m.format('YYYY-MM-DD'),
          year: m.year(),
          month: m.month() + 1,
          day: m.date(),
          times: [{
            open: date.date_legend.split('-')[0],
            close: date.date_legend.split('-')[1]
          }],
          original: date,
        };
      });
    });
  }
}
