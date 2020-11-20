import {Component, OnInit} from '@angular/core';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {PreferenceService} from '../../_services/preference.service';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit {
  public park?: Themepark = undefined;
  public rides?: Poi[];

  public parkService?: ThemeparkService;
  public rideArea = '';
  public displayType: 'cards' | 'list' = this.preferenceService.listType();

  public get areas(): string[] {
    const areas: string[] = [];
    if (this.rides) {
      this.rides.forEach(r => {
        if (r.area && !areas.includes(r.area)) {
          areas.push(r.area);
        }
      });
    }
    return areas;
  }

  public get selectedRides() {
    if (!this.rides) {
      return null;
    }

    return this.rides.filter(ride => {
      if (this.rideArea && ride.area != this.rideArea) {
        return;
      }

      return ride;
    });
  }

  constructor(public parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute,
              private preferenceService: PreferenceService) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
    });

    this.parksService.getParkService(parkId as string).then(value => {
      this.parkService = value;

      if (this.parkService.supportsWaitingTimes) {
        this.parkService.getPoisWithWaitingTimes().then((rides) => {
          this.rides = rides.filter(ride => ride.category == PoiCategory.ATTRACTION);

          rides.forEach(r => {
            console.log("R: " + r.id);
          })

          value.getWaitingTimes().then(value1 => {
            value1.forEach(wt => {
              console.log(`WT: ${wt.ride_id} : ${rides.filter(r => r.id == wt.ride_id)[0]}`);
            })
          })
        });
      } else {
        this.parkService.getRides().then((rides) => {
          this.rides = rides;
        });
      }
    });
  }

  public saveDisplayType($event: any) {
    this.preferenceService.listType($event);
  }
}
