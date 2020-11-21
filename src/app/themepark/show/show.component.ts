import { Component, OnInit } from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  public park?: Themepark = undefined;
  public show?: Poi;

  public parkService?: ThemeparkService;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');
    const showId = this.activatedRoute.snapshot.paramMap.get('show_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
    });

    this.parksService.getParkService(parkId as string).then(value => {
      this.parkService = value;

      const p: Promise<Poi[]> = this.parkService.supportsShowTimes ? this.parkService.getShowsWithShowTimes() : this.parkService.getShows();

      p.then()
        .then((shows) => {
          this.show = shows.filter(show => show.id == showId)[0];
        })
        .catch(reason => {
          console.error(reason);
          this.show = {
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
