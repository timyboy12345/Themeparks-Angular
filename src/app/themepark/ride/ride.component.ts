import {Component, OnInit} from '@angular/core';
import {Themepark} from "../../_interfaces/themepark.interface";
import {Poi, PoiCategory} from "../../_interfaces/poi.interface";
import {ThemeparkService} from "../../_services/themepark.service";
import {ThemeparksService} from "../../_services/themeparks.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ride',
  templateUrl: './ride.component.html',
  styleUrls: ['./ride.component.scss']
})
export class RideComponent implements OnInit {
  public park?: Themepark = undefined;
  public ride?: Poi;

  private parkService?: ThemeparkService;

  constructor(private parksService: ThemeparksService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const parkId = this.activatedRoute.snapshot.paramMap.get("park_id");
    const rideId = this.activatedRoute.snapshot.paramMap.get("ride_id");

    this.parksService.findPark(<string>parkId).then(park => {
      this.park = park;
    })

    this.parksService.getParkService(<string>parkId).then(value => {
      this.parkService = value;

      this.parkService.getPois()
        .then((rides) => {
          this.ride = rides.filter(ride => ride.id == rideId)[0];
          console.log(this.ride);

          value.getWaitingTimesOfRide(this.ride.id)
            .then((waitingtimes) => {
              console.log(waitingtimes);
            })
            .catch(reason => {
              console.error(reason);
            })
        })
        .catch(reason => {
          console.error(reason);
          this.ride = {
            id: "",
            category: PoiCategory.UNDEFINED,
            original_category: "",
            title: "",
            original: {}
          }
          window.alert("We konden de attractie niet ophalen");
        })
    });
  }
}
