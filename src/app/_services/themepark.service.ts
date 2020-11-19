import {Injectable} from '@angular/core';
import {Poi, PoiCategory} from '../_interfaces/poi.interface';
import {ThemeparkOptions} from '../_interfaces/themepark_options.interface';
import {WaitingTimes} from '../_interfaces/waitingtimes.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeparkService {
  private settings: ThemeparkOptions;

  constructor() {
    this.settings = {
      parkSupportsWaitingTimes: false,
      parkSupportsShowTimes: false,
      parkSupportsRideAreas: false,
      parkSupportsPois: false,
      parkSupportsOpeningTimes: false,
    };
  }

  public setSettings(options: ThemeparkOptions) {
    this.settings = options;
  }

  public get supportsPois(): boolean {
    return this.settings.parkSupportsPois ?? false;
  }

  public get supportsRideAreas(): boolean {
    return this.settings.parkSupportsRideAreas ?? false;
  }

  public get supportsWaitingTimes(): boolean {
    return this.settings.parkSupportsWaitingTimes ?? false;
  }

  public get supportsShowTimes(): boolean {
    return this.settings.parkSupportsShowTimes ?? false;
  }

  public get supportsOpeningTimes(): boolean {
    return this.settings.parkSupportsOpeningTimes ?? false;
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

  public getRestaurants(): Promise<Poi[]> {
    return this.getPois().then(value => {
      return value.filter(poi => poi.category == PoiCategory.RESTAURANT);
    });
  }

  public getWaitingTimes(): Promise<any[]> {
    throw new Error('This park does not have the getWaitingTimes() function');
  }

  public getWaitingTimesOfRide(rideId: string): Promise<WaitingTimes> {
    throw new Error('This park does not have the getWaitingTimesOfRide() function');
  }
}
