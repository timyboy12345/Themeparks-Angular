import {Injectable} from '@angular/core';
import {ThemeparkService} from "../themepark.service";
import {Poi, PoiCategory} from "../../_interfaces/poi.interface";
import {PhantasialandPoi} from "../../_interfaces/phantasialand/phantasialand_poi.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CacheService} from "../cache.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PhantasialandService extends ThemeparkService {
  private apiBase: string = `${environment.SHARED_API_URL}/phantasialand`;
  private apiToken: string = "auiJJnDpbIWrqt2lJBnD8nV9pcBCIprCrCxaWettkBQWAjhDAHtDxXBbiJvCzkUf";

  private lngMin: number = 6.878342628;
  private lngMax: number = 6.877570152;
  private latMin: number = 50.800659529;
  private latMax: number = 50.799683077;

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();
  }

  public async getPois(): Promise<Poi[]> {
    return await this.getPhantasialandPois().then(value => {
      return value.map((poi) => {
        let category: PoiCategory;

        switch (poi.category) {
          case "ATTRACTIONS":
            category = PoiCategory.ATTRACTION;
            break;
          case "SHOWS":
            category = PoiCategory.SHOW;
            break;
          case "SHOPS":
            category = PoiCategory.SHOP;
            break;
          case "RESTAURANTS_AND_SNACKS":
            category = PoiCategory.RESTAURANT;
            break;
          case "SERVICE":
            category = PoiCategory.SERVICE;
            break;
          case "PHANTASIALAND_HOTELS":
            category = PoiCategory.HOTEL;
            break;
          case "EVENT_LOCATIONS":
            category = PoiCategory.EVENT_LOCATION;
            break;
          case "PHANTASIALAND_HOTELS_RESTAURANTS":
            category = PoiCategory.HOTEL_RESTAURANT;
            break;
          case "PHANTASIALAND_HOTELS_BARS":
            category = PoiCategory.HOTEL_BAR;
            break;
          default:
            category = PoiCategory.UNDEFINED;
            break;
        }

        const bold = /\*\*(.*?)\*\*/gm;
        const heading = /---(.*?)---/gm;

        let description = poi.description
          .replace(heading, "<h3 class='text-lg'>$1</h3>")
          .replace(bold, "<strong>$1</strong>")

        const p: Poi = {
          id: poi.id.toString(),
          title: poi.title,
          description: description,
          image_url: poi.titleImage.url,
          category: category,
          original_category: poi.category,
          area: poi.area,
          original: poi,
        };
        return p;
      })
    })
  }

  public getPhantasialandPois(): Promise<PhantasialandPoi[]> {
    return this.cacheService.remember("phantasialand_pois", environment.CACHE_POIS_SECONDS, () => {
      const url = `${this.apiBase}/pois`;

      return this.httpClient.get<PhantasialandPoi[]>(url).toPromise();
    });
  }

  public getWaitingTimes(): Promise<any[]> {
    const url = `${this.apiBase}/waittimes`;

    const randomLat = Math.floor(Math.random() * this.latMax) + this.latMin;
    const randomLng = Math.floor(Math.random() * this.lngMax) + this.lngMin;

    const headers: HttpHeaders = new HttpHeaders({
      loc: `${randomLat},${randomLng}`,
      compact: "true",
      access_token: '8cbWt6gu8aEG2VLvDVS9G2dj5rjjnrBuExxbLHQEEoG6zgS0BYqy8eFyaKcZ8ZCH'
    });

    return this.httpClient.get<any[]>(url, {
      headers: headers
    }).toPromise();
  }
}
