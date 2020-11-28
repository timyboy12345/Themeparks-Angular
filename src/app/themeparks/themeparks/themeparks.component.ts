import {Component, OnInit} from '@angular/core';
import {ThemeparksService} from '../../_services/themeparks.service';
import {Themepark} from '../../_interfaces/themepark.interface';
import {TitleService} from '../../_services/title.service';
import {Country} from '../../_interfaces/country.interface';

@Component({
  selector: 'app-themeparks',
  templateUrl: './themeparks.component.html',
  styleUrls: ['./themeparks.component.scss']
})
export class ThemeparksComponent implements OnInit {
  public parks: Themepark[] = [];
  public selectedCountryId = '';

  public get selectedParks(): Themepark[] {
    return this.parks.filter((park) => {
      return this.selectedCountryId === '' || park.country.id === this.selectedCountryId ? park : null;
    });
  }

  public get countries(): Country[] {
    return this.parks.map((park) => {
      return park.country;
    });
  }

  constructor(private themeparksService: ThemeparksService,
              private titleService: TitleService) {
    this.titleService.setTitle('Alle pretparken');
  }

  ngOnInit(): void {
    this.themeparksService.getParks().then(value => {
      this.parks = value.filter(park => park.enabled);
    });
  }
}
