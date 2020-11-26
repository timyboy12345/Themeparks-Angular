import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {OpeningTimes} from '../../_interfaces/openingtimes.interface';

import * as moment from 'moment';
import {TitleService} from '../../_services/title.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public park?: Themepark;
  public pois?: Poi[];
  public restaurants?: Poi[];
  public openingTimes?: OpeningTimes;
  public shows?: Poi[];

  /**
   * Return the most popular rides based on the wait time
   */
  public get popularRides(): Poi[] | null {
    return this.pois ? this.pois
      .filter(p => p.category === PoiCategory.ATTRACTION)
      .filter(p => {
        if (this.parkService && this.parkService.supportsWaitingTimes) {
          return p.waitingTimes && p.waitingTimes.wait >= 0 ? p : null;
        } else {
          return p;
        }
      })
      .sort((a, b) => {
        if (this.parkService && this.parkService.supportsWaitingTimes && a.waitingTimes && b.waitingTimes) {
          return b.waitingTimes.wait - a.waitingTimes.wait;
        } else {
          return 0;
        }
      })
      .slice(0, 5) : null;
  }

  /**
   * Return the most popular restaurants based on the amount of minutes they are opened
   */
  public get popularRestaurants(): Poi[] | null {
    return this.restaurants ? this.restaurants
      .filter(p => p.category === PoiCategory.RESTAURANT || p.category === PoiCategory.BAR)
      .sort((a, b) => {
        const openA = a.openingTimes && a.openingTimes.length > 0
          ? moment(a.openingTimes[0].open).diff(a.openingTimes[0].close, 'minutes') : 0;
        const openB = b.openingTimes && b.openingTimes.length > 0
          ? moment(b.openingTimes[0].open).diff(b.openingTimes[0].close, 'minutes') : 0;

        if (openA > openB) {
          return 1;
        } else if (openA < openB) {
          return -1;
        } else {
          return 0;
        }
      })
      .slice(0, 5) : null;
  }

  public parkService?: ThemeparkService = undefined;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute,
              private titleService: TitleService) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
      this.titleService.setTitle(`${park.name}`);
    });

    this.parksService.getParkService(parkId as string)
      .then(parkService => {
        this.parkService = parkService;

        if (parkService.supportsPois) {
          const poiPromise: Promise<Poi[]> = parkService.supportsWaitingTimes
            ? this.parkService.getPoisWithWaitingTimes()
            : this.parkService.getPois();

          poiPromise
            .then((pois) => {
              this.pois = pois;
            })
            .catch(reason => {
              console.error(reason);
              this.pois = [];
            });
        }

        const restaurantPromise: Promise<Poi[]> = parkService.supportsRestaurantOpeningTimes
          ? this.parkService.getRestaurantsWithOpeningTimes()
          : this.parkService.getRestaurants();

        restaurantPromise
          .then(restaurants => {
            this.restaurants = restaurants;
          })
          .catch(reason => {
            console.error(reason);
            this.restaurants = [];
          });

        if (parkService.supportsOpeningTimes) {
          parkService.getOpeningTimesOfToday()
            .then(date => {
              if (date) {
                this.openingTimes = date;
              } else {
                this.openingTimes = {
                  date: moment().format('YYYY-MM-DD'),
                  original: null,
                  events: [],
                  year: moment().year(),
                  month: moment().month() + 1,
                  day: moment().date(),
                  times: []
                };
              }
            })
            .catch((reason) => {
              this.openingTimes = undefined;
              console.error(reason);
            });
        }

        if (parkService.supportsShows) {
          const promise = parkService.supportsShowTimes ? parkService.getShowsWithShowTimes() : parkService.getShows();

          promise
            .then(shows => {
              this.shows = shows;
            })
            .catch(reason => {
              console.error(reason);
              this.shows = [];
            });
        }
      })
      .catch((reason) => {
        console.error(reason);
        this.pois = [];
      });
  }
}
