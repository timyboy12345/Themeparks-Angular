import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-ride-card',
  templateUrl: './ride-card.component.html',
  styleUrls: ['./ride-card.component.scss']
})
export class RideCardComponent implements OnInit {
  @Input() ride?: Poi;
  @Input() showWaitingTimes = true;
  @Input() showArea = true;

  constructor() {
    this.ride = undefined;
  }

  ngOnInit(): void {
  }

}
