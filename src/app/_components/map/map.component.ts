import {AfterViewInit, Component, Input} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map: any;

  @Input() lat = 0;
  @Input() lng = 0;
  @Input() zoom = 5;

  @Input() cardTitle = 'Kaart';
  @Input() cardSubTitle = 'Sleep om te verplaatsen';

  constructor() {
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lng],
      zoom: this.zoom
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    const marker = L.marker([this.lat, this.lng], {
      icon
    })
      .addTo(this.map);
  }
}
