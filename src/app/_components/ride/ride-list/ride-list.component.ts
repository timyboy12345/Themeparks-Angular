import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.scss']
})
export class RideListComponent implements OnInit {
  @Input() rides?: Poi[];
  @Input() url = '{RIDE_ID}';

  constructor() { }

  ngOnInit(): void {
  }

  public getParsedRideUrl(ride: Poi): string {
    return this.url.replace('{RIDE_ID}', ride.id);
  }
}
