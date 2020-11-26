import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {WaitingTimes} from '../../_interfaces/waitingtimes.interface';
import {TitleService} from '../../_services/title.service';

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.scss']
})
export class RideComponent implements OnInit {
  public park?: Themepark = undefined;
  public ride?: Poi;

  public parkService?: ThemeparkService;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute,
              private titleService: TitleService) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');
    const rideId = this.activatedRoute.snapshot.paramMap.get('ride_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
    });

    this.parksService.getParkService(parkId as string).then(value => {
      this.parkService = value;

      const p: Promise<Poi[]> = this.parkService.supportsWaitingTimes
        ? this.parkService.getPoisWithWaitingTimes()
        : this.parkService.getPois();

      p.then()
        .then((rides) => {
          this.ride = rides.filter(ride => ride.id === rideId)[0];
          this.titleService.setTitle(`${this.ride.title} - ${this.park?.name}`);
        })
        .catch(reason => {
          console.error(reason);
          this.ride = {
            id: '',
            category: PoiCategory.UNDEFINED,
            original_category: '',
            title: '',
            original: {}
          };
        });
    });
  }
}
