import { Component, OnInit } from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {PreferenceService} from '../../_services/preference.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss']
})
export class ShowsComponent implements OnInit {
  public park?: Themepark = undefined;
  public shows?: Poi[];

  public parkService?: ThemeparkService;
  public showArea = '';
  public displayType: 'cards' | 'list' = this.preferenceService.listType();

  public get areas(): string[] {
    const areas: string[] = [];
    if (this.shows) {
      this.shows.forEach(r => {
        if (r.area && !areas.includes(r.area)) {
          areas.push(r.area);
        }
      });
    }
    return areas;
  }

  public get selectedshows() {
    if (!this.shows) {
      return null;
    }

    return this.shows.filter(show => {
      if (this.showArea && show.area != this.showArea) {
        return;
      }

      return show;
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

      const promise = this.parkService.supportsShowTimes ? this.parkService.getShowsWithShowTimes() : this.parkService.getShows();

      promise
        .then((shows) => {
          this.shows = shows;
        })
        .catch(reason => {
          this.shows = [];
        });
    });
  }

  public saveDisplayType($event: any) {
    this.preferenceService.listType($event);
  }
}