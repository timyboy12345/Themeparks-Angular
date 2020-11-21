import {Injectable} from '@angular/core';
import {ThemeparkService} from '../themepark.service';
import {Poi, PoiCategory, PoiOpeningTime} from '../../_interfaces/poi.interface';
import {EftelingPoi} from '../../_interfaces/efteling/efteling_poi.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CacheService} from '../cache.service';
import {environment} from '../../../environments/environment';
import {
  EftelingAttractionInfo,
  EftelingAttractionInfoType,
  EftelingWaitTimesResponse
} from '../../_interfaces/efteling/efteling_waittimesresponse.interface';
import {WaitingTimes, WaitingTimesState} from '../../_interfaces/waitingtimes.interface';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Country} from '../../_interfaces/country.interface';
import {ThemeparkOptions} from '../../_interfaces/themepark_options.interface';
import {OpeningTimes, OpeningtimesEvent, OpeningTimesTimeslot} from '../../_interfaces/openingtimes.interface';
import {EftelingOpeningTimesResponse, EftelingOpeningTimesShow} from '../../_interfaces/efteling/efteling_openingtimesresponse.interface';

import * as moment from 'moment';
import {ShowTime} from '../../_interfaces/showtimes.interface';

@Injectable({
  providedIn: 'root'
})
export class EftelingService extends ThemeparkService {
  // private apiUrl: string = `https://cors-anywhere.herokuapp.com/http://prd-search-acs.efteling.com/2013-01-01`;
  // private waitTimesUrl: string = "https://cors-anywhere.herokuapp.com/https://api.efteling.com/app/wis/";

  private apiUrl = `${environment.SHARED_API_URL}/efteling`;
  private apiLang = 'nl';

  private waitTimesPromise?: Promise<any>;

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  supports(): ThemeparkOptions {
    return {
      parkSupportsOpeningTimes: true,
      parkSupportsPois: true,
      parkSupportsRideAreas: true,
      parkSupportsShows: true,
      parkSupportsShowTimes: true,
      parkSupportsWaitingTimes: true,
      parkSupportsRestaurantOpeningTimes: true,
    };
  }

  public getInfo(country: Country): Themepark {
    return {
      id: 'efteling_nl',
      name: 'Efteling',
      description: 'Reserveer je bezoek of blijf slapen. Beleef een sprookjesachtige winter in de Efteling! Geniet van winterse attracties en duizenden twinkelende lichtjes in de Winter Efteling. Spectaculaire achtbanen. Adembenemende attracties. Laat je verwonderen. Wereld vol Wonderen.',
      service: this,
      country: country,
      enabled: true,
      image_url: 'https://www.efteling.com/nl/-/media/images/wereld-vol-wonderen/1600x900-en-toen-winter-efteling.jpg?h=900&w=1600&focuspoint=-0.01%2c-0.19&hash=CD8DA332297BA0BF60CE9780C38A94A8',
      options: this.supports()
    };
  }

  public getEftelingPois(): Promise<EftelingPoi[]> {
    return this.cacheService.remember<EftelingPoi[]>('efteling_pois', environment.CACHE_POIS_SECONDS, () => {
      const headers: HttpHeaders = new HttpHeaders({
        'x-api-key': 'RMHA53uMzT3ZQhrqoxujG6aVPPYwozMz5Gsb21I9',
        'x-api-version': '7',
        'X-App-Version': 'v3.5.0'
      });

      return this.httpClient.get<any>(`${this.apiUrl}/pois`, {
        headers
      })
        .toPromise()
        .then(value => {
          return value.hits.hit;
        });
    });
  }

  public getPois(): Promise<Poi[]> {
    return this.getEftelingPois().then(value => {
      return value.map(poi => {
        let c = PoiCategory.UNDEFINED;

        switch (poi.fields.category) {
          case 'attraction':
            c = PoiCategory.ATTRACTION;
            break;
          case 'eventlocation':
            c = PoiCategory.EVENT_LOCATION;
            break;
          case 'game':
            c = PoiCategory.GAME;
            break;
          case 'facilities-generic':
            c = PoiCategory.SERVICE;
            break;
          case 'facilities-toilets':
            c = PoiCategory.TOILETS;
            break;
          case 'facilities-swimmingpool':
            c = PoiCategory.POOL;
            break;
          case 'first-aid':
            c = PoiCategory.FIRSTAID;
            break;
          case 'merchandise':
            c = PoiCategory.SHOP;
            break;
          case 'restaurant':
            c = PoiCategory.RESTAURANT;
            break;
          case 'show':
            c = PoiCategory.SHOW;
            break;
          default:
            break;
        }

        const images: string[] = [];
        if (poi.fields.image_detailview1) {
          images.push(`https://efteling.com/${poi.fields.image_detailview1}`);
        }
        if (poi.fields.image_detailview2) {
          images.push(`https://efteling.com/${poi.fields.image_detailview2}`);
        }
        if (poi.fields.image_detailview3) {
          images.push(`https://efteling.com/${poi.fields.image_detailview3}`);
        }
        if (poi.fields.image_detailview4) {
          images.push(`https://efteling.com/${poi.fields.image_detailview4}`);
        }

        const p: Poi = {
          id: poi.id.split(`-${this.apiLang}`)[0],
          category: c,
          original_category: poi.fields.category,
          title: poi.fields.name,
          description: poi.fields.detail_text,
          fastpass: false,
          original: poi,
          area: poi.fields.empire,
          image_url: `https://efteling.com/${poi.fields.image_detailview1 ?? poi.fields.image}`,
          entrance: {
            world: {
              lat: parseFloat(poi.fields.latlon.split(',')[0]),
              lng: parseFloat(poi.fields.latlon.split(',')[1])
            }
          },
          images
        };

        return p;
      });
    });
  }

  public getEftelingWaitingTimes(): Promise<EftelingWaitTimesResponse> {
    if (this.waitTimesPromise) {
      return this.waitTimesPromise;
    }

    const p = this.cacheService.remember<EftelingWaitTimesResponse>('efteling_waittimes', environment.CACHE_WAITINGTIMES_SECONDS, () => {
      return this.httpClient.get<EftelingWaitTimesResponse>(`${this.apiUrl}/waittimes`).toPromise();
    });

    this.waitTimesPromise = p;

    return p;
  }

  public getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getEftelingWaitingTimes().then(value => {
      const rides = value.AttractionInfo.filter(ride => ride.Type == EftelingAttractionInfoType.ATTRACTION);

      return rides.map(ride => {
        let state: WaitingTimesState = WaitingTimesState.CLOSED;

        switch (ride.State) {
          case 'open':
            state = WaitingTimesState.OPEN;
            break;
          default:
            break;
        }

        const wait: WaitingTimes = {
          date: Date.now().toString(),
          ride_id: ride.Id,
          state,
          wait: ride.WaitingTime,
          original: ride,
        };
        return wait;
      });
    });
  }

  public getWaitingTimesOfRide(rideId: string): Promise<WaitingTimes> {
    return this.getWaitingTimes().then(value => {
      return value.filter(ride => ride.ride_id == rideId)[0];
    });
  }

  private getEftelingOpeningTimes(year: number, month: number): Promise<EftelingOpeningTimesResponse> {
    return this.cacheService.remember<EftelingOpeningTimesResponse>('efteling_openingtimes', environment.CACHE_OPENINGTIMES_SECONDS, () => {
      return this.httpClient.get<EftelingOpeningTimesResponse>(`${this.apiUrl}/openingtimes?year=${year}&month=${month}`).toPromise();
    });
  }

  getOpeningTimesOfMonth(year: number, month: number): Promise<OpeningTimes[]> {
    return this.getEftelingOpeningTimes(year, month).then(value => {
      return value.OpeningHours.map(date => {
        const d = moment(date.Date);

        const openingTimes: OpeningTimesTimeslot[] = [];
        date.OpeningHours.forEach(slot => {
          openingTimes.push({
            open: slot.Open,
            close: slot.Close
          });
        });

        const events: OpeningtimesEvent[] = [];
        value.Events.forEach(event => {
          if (moment().diff(event.DateFrom, 'days') >= 0 && moment().diff(event.DateTo, 'days') <= 0) {
            events.push({
              begin: event.DateFrom,
              end: event.DateTo,
              title: event.Name,
              type: 'informative',
              description: event.Description,
              show: true
            });
          }
        });

        return {
          date: d.format('YYYY-MM-DD'),
          year: parseInt(d.format('YYYY')),
          month: parseInt(d.format('MM')),
          day: parseInt(d.format('DD')),
          events: events,
          times: openingTimes,
          original: date
        };
      });
    });
  }

  getOpeningTimesOfDay(year: number, month: number, day: number): Promise<OpeningTimes> {
    return this.getOpeningTimesOfMonth(year, month).then(value => {
      return value.filter(date => date.day == day)[0];
    });
  }

  getShows(): Promise<Poi[]> {
    return this.getPois().then(value => {
      return value.filter(poi => poi.category == PoiCategory.SHOW);
    });
  }

  private getEftelingShowTimes(): Promise<EftelingOpeningTimesShow[]> {
    return this.getEftelingOpeningTimes(moment().year(), moment().month() + 1).then(value => {
      return value.Shows;
    });
  }

  getShowsWithShowTimes(): Promise<Poi[]> {
    return Promise.all([
      this.getShows(),
      this.getEftelingShowTimes(),
      this.getEftelingPois(),
      this.getEftelingWaitingTimes(),
    ]).then((value) => {
      return value[0].map(poi => {
        const showTimes: ShowTime[] = [];
        const todayDateShowTimes: ShowTime[] = [];
        const otherDateShowTimes: ShowTime[] = [];
        const pastShowTimes: ShowTime[] = [];
        const futureShowTimes: ShowTime[] = [];

        value[1].filter(st => st.Name == poi.title).forEach(eftelingShowTimes => {
          const poiData = value[2].filter(p => p.id == poi.id)[0];
          const waitData = value[3].AttractionInfo.filter(wd => wd.Id == poi.id)[0];

          eftelingShowTimes.ShowDates.forEach((eftelingShowTime) => {
            let edition = undefined;

            if (waitData) {
              if (waitData.ShowTimes && waitData.ShowTimes.length > 0) {
                const time = waitData.ShowTimes.filter(st => st.StartDateTime == eftelingShowTime)[0];

                if (time && time.Edition) {
                  edition = time.Edition;
                }
              }

              if (!edition && waitData.PastShowTimes && waitData.PastShowTimes.length > 0) {
                const time = waitData.PastShowTimes.filter(st => st.StartDateTime == eftelingShowTime)[0];

                if (time && time.Edition) {
                  edition = time.Edition;
                }
              }
            }

            const st: ShowTime = {
              from: moment(eftelingShowTime).format('YYYY-MM-DDTHH:mm:ss'),
              fromTime: moment(eftelingShowTime).format('HH:mm:ss'),
              isPassed: moment(eftelingShowTime).isBefore(moment()),
              duration: poiData ? poiData.fields.showduration : undefined,
              edition: edition
            };

            showTimes.push(st);

            if (moment().isSame(eftelingShowTime, 'day')) {
              todayDateShowTimes.push(st);

              if (moment().diff(eftelingShowTime) > 0) {
                pastShowTimes.push(st);
              } else {
                futureShowTimes.push(st);
              }
            } else {
              otherDateShowTimes.push(st);
            }
          });
        });

        poi.showTimes = {
          currentDate: moment().format('DD MM YYYY'),
          allShowTimes: showTimes,
          todayShowTimes: todayDateShowTimes,
          otherDateShowTimes: otherDateShowTimes,
          pastShowTimes: pastShowTimes,
          futureShowTimes: futureShowTimes,
        };

        return poi;
      });
    });
  }

  private getEftelingRestaurantOpeningTimes(): Promise<EftelingAttractionInfo[]> {
    return this.getEftelingWaitingTimes().then(value => {
      return value.AttractionInfo.filter(poi => poi.Type == EftelingAttractionInfoType.HORECA).map(restaurant => {
        return restaurant;
      });
    });
  }

  getRestaurantsWithOpeningTimes(): Promise<Poi[]> {
    return Promise.all([
      this.getRestaurants(),
      this.getEftelingRestaurantOpeningTimes(),
    ]).then(value => {
      return value[0].map(restaurant => {
        const poi = value[1].filter(r => r.Id == restaurant.id)[0];
        const eftelingOpeningTimes = poi ? poi.OpeningTimes : undefined;
        console.log(restaurant);
        console.log(poi);

        restaurant.openingTimes = [];

        if (eftelingOpeningTimes) {
          eftelingOpeningTimes.forEach(openingTime => {
            if (restaurant.openingTimes) {
              restaurant.openingTimes.push({
                open: openingTime.HourFrom,
                close: openingTime.HourTo
              });
            }
          })
        }

        return restaurant;
      });
    });
  }
}
