import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {WaitingTimes} from '../../_interfaces/waitingtimes.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public park?: Themepark;
  public pois?: Poi[];

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
          if (value.supportsWaitingTimes) {
            this.parkService.getPoisWithWaitingTimes().then(rides => {
              this.pois = rides;
            });
          } else {
            this.parkService.getPois().then(rides => {
              this.pois = rides;
            });
          }
        }

        if (value.supportsWaitingTimes) {
          this.parkService.getWaitingTimes().then(value => {
          });
        }
      })
      .catch(reason => {
        this.pois = [];
      });
  }
}
