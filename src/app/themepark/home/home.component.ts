import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {WaitingTimes} from '../../_interfaces/waitingtimes.interface';
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
  public openingTimes?: OpeningTimes;

  public get popularRides() {
    return this.pois ? this.pois.filter(p => p.category == PoiCategory.ATTRACTION).slice(0, 5) : null;
  }

  public get popularRestaurants() {
    return this.pois ? this.pois.filter(p => p.category == PoiCategory.RESTAURANT).slice(0, 5) : null;
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
      .then(value => {
        this.parkService = value;

        if (value.supportsPois) {
          const p: Promise<Poi[]> = value.supportsWaitingTimes ? this.parkService.getPoisWithWaitingTimes() : this.parkService.getPois();

          p
            .then((pois) => {
              this.pois = pois;
            })
            .catch(reason => {
              console.error(reason);
              this.pois = [];
            });
        }

        if (value.supportsOpeningTimes) {
          value.getOpeningTimesOfDay(moment().year(), moment().month() + 1, moment().day())
            .then(date => {
              this.openingTimes = date;
            })
            .catch((reason) => {
              this.openingTimes = undefined;
            });
        }
      })
      .catch((reason) => {
        console.error(reason);
        this.pois = [];
      });
  }
}
