import {Component, OnInit} from '@angular/core';
import {Themepark} from '../../_interfaces/themepark.interface';
import {Poi, PoiCategory} from '../../_interfaces/poi.interface';
import {ThemeparkService} from '../../_services/themepark.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../_services/title.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  public park?: Themepark = undefined;
  public restaurant?: Poi;

  public parkService?: ThemeparkService;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute,
              private titleService: TitleService) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get('park_id');
    const restaurantId = this.activatedRoute.snapshot.paramMap.get('restaurant_id');

    this.parksService.findPark(parkId as string).then(park => {
      this.park = park;
    });

    this.parksService.getParkService(parkId as string).then(value => {
      this.parkService = value;

      const promise = this.parkService.supportsRestaurantOpeningTimes
        ? this.parkService.getRestaurantsWithOpeningTimes()
        : this.parkService.getRestaurants();

      promise.then()
        .then((pois) => {
          this.restaurant = pois.filter(r => r.id === restaurantId)[0];
          this.titleService.setTitle(`${this.restaurant.title} - ${this.park?.name}`);
        })
        .catch(reason => {
          console.error(reason);
          this.restaurant = {
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
