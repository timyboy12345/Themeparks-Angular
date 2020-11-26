import {Component, Input, OnInit} from '@angular/core';
import {Poi} from '../../../_interfaces/poi.interface';

@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
  @Input() shows?: Poi[];
  @Input() url: string = "{SHOW_ID}"

  constructor() { }

  ngOnInit(): void {
  }

  public getParsedShowUrl(show: Poi): string {
    return this.url.replace('{SHOW_ID}', show.id);
  }
}
