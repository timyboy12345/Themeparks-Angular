import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {OpeningTimes} from '../../_interfaces/openingtimes.interface';

import * as moment from 'moment';

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

  public get popularRides() {
    return this.pois ? this.pois.filter(p => p.category == PoiCategory.ATTRACTION).slice(0, 5) : null;
  }

  public get popularRestaurants() {
    return this.restaurants ? this.restaurants.filter(p => p.category == PoiCategory.RESTAURANT || p.category == PoiCategory.BAR).slice(0, 5) : null;
  }

  public parkService?: ThemeparkService = undefined;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
    });

    this.parksService.getParkService(parkId as string)
      .then(parkService => {
        this.parkService = parkService;

        if (parkService.supportsPois) {
          const poiPromise: Promise<Poi[]> = parkService.supportsWaitingTimes ? this.parkService.getPoisWithWaitingTimes() : this.parkService.getPois();
          poiPromise
            .then((pois) => {
              this.pois = pois;
            })
            .catch(reason => {
              console.error(reason);
              this.pois = [];
            });
        }

        const restaurantPromise: Promise<Poi[]> = parkService.supportsRestaurantOpeningTimes ? this.parkService.getRestaurantsWithOpeningTimes() : this.parkService.getRestaurants();
        restaurantPromise
          .then(restaurants => {
            this.restaurants = restaurants;
          })
          .catch(reason => {
            console.error(reason);
            this.restaurants = [];
          });

        if (parkService.supportsOpeningTimes) {
          parkService.getOpeningTimesOfDay(moment().year(), moment().month() + 1, moment().date())
            .then(date => {
              this.openingTimes = date;
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
