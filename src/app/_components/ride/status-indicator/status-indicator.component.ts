import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';
import {ThemeparksService} from '../../../_services/themeparks.service';

@Component({
  selector: 'app-ride-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss']
})
export class StatusIndicatorComponent implements OnInit {
  @Input() ride?: Poi;

  constructor(private themeparksService: ThemeparksService) { }

  ngOnInit(): void {
  }

}
