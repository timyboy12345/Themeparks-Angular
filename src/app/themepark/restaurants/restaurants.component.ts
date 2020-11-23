import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {PreferenceService} from '../../_services/preference.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {
  public park?: Themepark = undefined;
  public restaurants?: Poi[];

  public parkService?: ThemeparkService;
  public restaurantArea = '';
  public displayType: 'cards' | 'list' = this.preferenceService.listType();
  public openingTimes: 'all' | 'open_today' = 'all';

  public get areas(): string[] {
    const areas: string[] = [];
    if (this.restaurants) {
      this.restaurants.forEach(r => {
        if (r.area && !areas.includes(r.area)) {
          areas.push(r.area);
        }
      });
    }
    return areas;
  }

  public get selectedRestaurants() {
    if (!this.restaurants) {
      return null;
    }

    return this.restaurants.filter(restaurant => {
      if (this.restaurantArea && restaurant.area != this.restaurantArea) {
        return;
      }

      if (this.openingTimes == 'open_today' && (!restaurant.openingTimes || restaurant.openingTimes.length == 0)) {
        return;
      }

      return restaurant;
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

    this.parksService.getParkService(parkId as string).then(themeparkService => {
      this.parkService = themeparkService;

      const promise = themeparkService.supportsRestaurantOpeningTimes ? themeparkService.getRestaurantsWithOpeningTimes() : themeparkService.getRestaurants();

      promise
        .then((pois) => {
          this.restaurants = pois;
        })
        .catch(reason => {
          this.restaurants = [];
        });
    });
  }

  public saveDisplayType($event: any) {
    this.preferenceService.listType($event);
  }
}
