import {Injectable} from '@angular/core';
import {Poi, PoiCategory} from '../_interfaces/poi.interface';
import {ThemeparkOptions} from '../_interfaces/themepark_options.interface';
import {WaitingTimes} from '../_interfaces/waitingtimes.interface';
import {Themepark} from '../_interfaces/themepark.interface';
import {Country} from '../_interfaces/country.interface';
import {OpeningTimes} from '../_interfaces/openingtimes.interface';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ThemeparkService {
  constructor() {
  }

  public supports(): ThemeparkOptions {
    return {
      parkSupportsOpeningTimes: false,
      parkSupportsPois: true,
      parkSupportsRideAreas: false,
      parkSupportsWaitingTimes: false,
      parkSupportsShows: false,
      parkSupportsShowTimes: false,
      parkSupportsRestaurantOpeningTimes: false,
    };
  }

  public get supportsPois(): boolean {
    return this.supports().parkSupportsPois ?? false;
  }

  public get supportsRideAreas(): boolean {
    return this.supports().parkSupportsRideAreas ?? false;
  }

  public get supportsWaitingTimes(): boolean {
    return this.supports().parkSupportsWaitingTimes ?? false;
  }

  public get supportsShows() {
    return this.supports().parkSupportsShows ?? false;
  }

  public get supportsShowTimes(): boolean {
    return this.supports().parkSupportsShowTimes ?? false;
  }

  public get supportsOpeningTimes(): boolean {
    return this.supports().parkSupportsOpeningTimes ?? false;
  }

  public get supportsRestaurantOpeningTimes(): boolean {
    return this.supports().parkSupportsRestaurantOpeningTimes ?? false;
  }

  public getPois(): Promise<Poi[]> {
    throw new Error('This park does not have the getPois() function');
  }

  public getRides(): Promise<Poi[]> {
    return this.getPois().then(value => {
      return value.filter(poi => poi.category == PoiCategory.ATTRACTION);
    });
  }

  public getShows(): Promise<Poi[]> {
    return this.getPois().then(value => {
      return value.filter(poi => poi.category == PoiCategory.SHOW);
    });
  }

  public getShowsWithShowTimes(): Promise<Poi[]> {
    throw new Error('This park does not have an implementation for getShowsWithShowTimes()');
  }

  public getRestaurants(): Promise<Poi[]> {
    return this.getPois().then(value => {
      return value.filter(poi => poi.category == PoiCategory.RESTAURANT || poi.category == PoiCategory.BAR);
    });
  }

  public getRestaurantsWithOpeningTimes(): Promise<Poi[]> {
    throw new Error('This park does not have an implementation for getRestaurantsWithOpeningTimes()');
  }

  public getWaitingTimes(): Promise<WaitingTimes[]> {
    throw new Error('This park does not have the getWaitingTimes() function');
  }

  public getWaitingTimesOfRide(rideId: string): Promise<WaitingTimes> {
    throw new Error('This park does not have the getWaitingTimesOfRide() function');
  }

  public getPoisWithWaitingTimes(): Promise<Poi[]> {
    return Promise.all([
      this.getWaitingTimes(),
      this.getPois()
    ]).then((value: [WaitingTimes[], Poi[]]) => {
      return value[1].map((poi) => {
        poi.waitingTimes = value[0].filter(wt => wt.ride_id == poi.id)[0];

        return poi;
      });
    })
  }

  public getInfo(country: Country): Themepark {
    throw new Error('This park does not have the getInfo() function');
  }

  public getOpeningTimesOfDay(year: number, month: number, day: number): Promise<OpeningTimes> {
    throw new Error('This park does not have the getOpeningTimesOfDay() function');
  }

  public getOpeningTimesOfMonth(year: number, month: number): Promise<OpeningTimes[]> {
    throw new Error('This park does not have the getOpeningTimesOfMonth() function');
  }

  public getOpeningTimesOfYear(year: number): Promise<OpeningTimes[]> {
    throw new Error('This park does not have the getOpeningTimesOfYear() function');
  }

  public getOpeningTimesOfToday(): Promise<OpeningTimes> {
    const year = moment().year();
    const month = moment().month() + 1;
    const day = moment().date();
    return this.getOpeningTimesOfDay(year, month, day);
  }
}
