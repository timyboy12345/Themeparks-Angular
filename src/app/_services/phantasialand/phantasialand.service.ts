import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {PhantasialandPoi} from '../../_interfaces/phantasialand/phantasialand_poi.interface';
import {HttpClient} from '@angular/common/http';
import {CacheService} from '../cache.service';
import {environment} from '../../../environments/environment';
import {Country} from '../../_interfaces/country.interface';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkOptions} from '../../_interfaces/themepark_options.interface';
import {PhantasialandWaitTimeResponse} from '../../_interfaces/phantasialand/phantasialand_waittimeresponse.interface';
import {WaitingTimes, WaitingTimesState} from '../../_interfaces/waitingtimes.interface';
import {ShowTime} from '../../_interfaces/showtimes.interface';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PhantasialandService extends ThemeparkService {
  private apiBase = `${environment.SHARED_API_URL}/phantasialand`;

  public supports(): ThemeparkOptions {
    return {
      parkSupportsPois: true,
      parkSupportsWaitingTimes: true,
      parkSupportsShows: true,
      parkSupportsShowTimes: true,
      parkSupportsRideAreas: true,
      parkSupportsOpeningTimes: false,
    };
  }

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  public getInfo(country: Country): Themepark {
    return {
      id: 'phantasialand_de',
      name: 'Phantasialand',
      description: 'Wereldwijd unieke en recordbrekende attracties in 6 themawerelden, spectaculaire shows, magisch overnachten en uitzonderlijk eten & drinken.',
      service: this,
      country,
      enabled: true,
      image_url: 'https://static.phlcdn.de/files/uploads/themenpark/images/winter/berlin/wellenflug/ga-winter-wellenflug_05.jpg',
      options: this.supports()
    };
  }

  public async getPois(): Promise<Poi[]> {
    return await this.getPhantasialandPois().then(value => {
      return value.map((poi) => {
        let category: PoiCategory;

        switch (poi.category) {
          case 'ATTRACTIONS':
            category = PoiCategory.ATTRACTION;
            break;
          case 'SHOWS':
            category = PoiCategory.SHOW;
            break;
          case 'SHOPS':
            category = PoiCategory.SHOP;
            break;
          case 'RESTAURANTS_AND_SNACKS':
            category = PoiCategory.RESTAURANT;
            break;
          case 'SERVICE':
            category = PoiCategory.SERVICE;
            break;
          case 'PHANTASIALAND_HOTELS':
            category = PoiCategory.HOTEL;
            break;
          case 'EVENT_LOCATIONS':
            category = PoiCategory.EVENT_LOCATION;
            break;
          case 'PHANTASIALAND_HOTELS_RESTAURANTS':
            category = PoiCategory.HOTEL_RESTAURANT;
            break;
          case 'PHANTASIALAND_HOTELS_BARS':
            category = PoiCategory.HOTEL_BAR;
            break;
          default:
            category = PoiCategory.UNDEFINED;
            break;
        }

        const bold = /\*\*(.*?)\*\*/gm;
        const heading = /(---)/gm;

        const description = (poi.description.nl ?? '')
          // .replace(heading, '<h3 class="text-lg mt-2 mb-1 text-indigo-800 font-bold">$1</h3>')
          .replace(heading, '<br/><br/>')
          .replace(bold, '<strong>$1</strong>');

        const p: Poi = {
          id: poi.id.toString(),
          title: poi.title.nl,
          description,
          image_url: poi.titleImage.url,
          category,
          original_category: poi.category,
          area: poi.area,
          original: poi
        };

        return p;
      });
    });
  }

  public getPhantasialandPois(): Promise<PhantasialandPoi[]> {
    return this.cacheService.remember('phantasialand_pois', environment.CACHE_POIS_SECONDS, () => {
      const url = `${this.apiBase}/pois`;

      return this.httpClient.get<PhantasialandPoi[]>(url).toPromise();
    });
  }

  public getPhantasialandWaitingTimes(): Promise<PhantasialandWaitTimeResponse[]> {
    return this.cacheService
      .remember<PhantasialandWaitTimeResponse[]>('phantasialand_waittimes', environment.CACHE_WAITINGTIMES_SECONDS, () => {
        const url = `${this.apiBase}/waittimes`;

        return this.httpClient.get<PhantasialandWaitTimeResponse[]>(url).toPromise();
      });
  }

  public getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getPhantasialandWaitingTimes().then(value => {
      return value.map((wait) => {
        const w: WaitingTimes = {
          wait: wait.waitTime,
          state: wait.open ? WaitingTimesState.OPEN : WaitingTimesState.CLOSED,
          ride_id: wait.poiId.toString(),
          original: wait
        };

        return w;
      });
    });
  }

  getShows(): Promise<Poi[]> {
    return this.getPois().then(pois => {
      return pois.filter(value => value.category === PoiCategory.SHOW);
    });
  }

  getShowsWithShowTimes(): Promise<Poi[]> {
    return Promise.all([
      this.getShows(),
      this.getPhantasialandWaitingTimes(),
    ]).then(value => {
      return value[0].map(show => {
        const todayShowTimes: ShowTime[] = [];
        const futureShowTimes: ShowTime[] = [];
        const pastShowTimes: ShowTime[] = [];
        const allShowTimes: ShowTime[] = [];

        value[1].map(waitingTimes => {
          if (waitingTimes.showTimes) {
            waitingTimes.showTimes.forEach(showTime => {
              const s: ShowTime = {from: showTime, fromTime: showTime, isPassed: moment(showTime).isBefore(moment())};

              if (moment().isSame(showTime, 'date')) {
                todayShowTimes.push(s);
              } else {
                allShowTimes.push(s);
              }
            });
          }
        });

        show.showTimes = {
          currentDate: moment().format('DD-MM-YYYY HH:mm'),
          todayShowTimes,
          futureShowTimes,
          pastShowTimes,
          allShowTimes
        };

        return show;
      });
    });
  }
}
