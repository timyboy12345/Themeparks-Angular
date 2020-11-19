import {Injectable} from '@angular/core';
import {ThemeparkService} from "../themepark.service";
import {Poi, PoiCategory} from "../../_interfaces/poi.interface";
import {EftelingPoi} from "../../_interfaces/efteling/efteling_poi.interface";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CacheService} from "../cache.service";
import {environment} from "../../../environments/environment";
import {
  EftelingAttractionInfoType,
  EftelingWaitTimesResponse
} from "../../_interfaces/efteling/waittimesresponse.interface";
import {WaitingTimes, WaitingTimesState} from "../../_interfaces/waitingtimes.interface";

@Injectable({
  providedIn: 'root'
})
export class EftelingService extends ThemeparkService {
  // private apiUrl: string = `https://cors-anywhere.herokuapp.com/http://prd-search-acs.efteling.com/2013-01-01`;
  // private waitTimesUrl: string = "https://cors-anywhere.herokuapp.com/https://api.efteling.com/app/wis/";

  private apiUrl: string = `${environment.SHARED_API_URL}/efteling`;
  private apiLang: string = "nl";

  private waitTimesPromise?: Promise<any>;

  constructor(private httpClient: HttpClient,
              private cacheService: CacheService) {
    super();

    this.setSettings({
      parkSupportsOpeningTimes: true,
      parkSupportsPois: true,
      parkSupportsRideAreas: true,
      parkSupportsShowTimes: true,
      parkSupportsWaitingTimes: true
    })
  }

  public getEftelingPois(): Promise<EftelingPoi[]> {
    return this.cacheService.remember<EftelingPoi[]>('efteling_pois', environment.CACHE_POIS_SECONDS, () => {
      const headers: HttpHeaders = new HttpHeaders({
        'x-api-key': 'RMHA53uMzT3ZQhrqoxujG6aVPPYwozMz5Gsb21I9',
        'x-api-version': '7',
        'X-App-Version': 'v3.5.0'
      })

      return this.httpClient.get<any>(`${this.apiUrl}/pois`, {
        headers: headers
      })
        .toPromise()
        .then(value => {
          return value.hits.hit;
        });
    });
  }

  public getPois(): Promise<Poi[]> {
    return this.getEftelingPois().then(value => {
      return value.map(poi => {
        let c = PoiCategory.UNDEFINED;

        switch (poi.fields.category) {
          case "attraction":
            c = PoiCategory.ATTRACTION;
            break;
          case "eventlocation":
            c = PoiCategory.EVENT_LOCATION;
            break;
          case "game":
            c = PoiCategory.GAME;
            break;
          case "facilities-generic":
            c = PoiCategory.SERVICE;
            break;
          case "facilities-toilets":
            c = PoiCategory.TOILETS;
            break;
          case "facilities-swimmingpool":
            c = PoiCategory.POOL;
            break;
          case "first-aid":
            c = PoiCategory.FIRSTAID;
            break;
          case "merchandise":
            c = PoiCategory.SHOP;
            break;
          case "restaurant":
            c = PoiCategory.RESTAURANT;
            break;
          case "show":
            c = PoiCategory.SHOW;
            break;
          default:
            break;
        }

        const images: string[] = [];
        if (poi.fields.image_detailview1) images.push(`https://efteling.com/${poi.fields.image_detailview1}`);
        if (poi.fields.image_detailview2) images.push(`https://efteling.com/${poi.fields.image_detailview2}`);
        if (poi.fields.image_detailview3) images.push(`https://efteling.com/${poi.fields.image_detailview3}`);
        if (poi.fields.image_detailview4) images.push(`https://efteling.com/${poi.fields.image_detailview4}`);

        const p: Poi = {
          id: poi.id,
          category: c,
          original_category: poi.fields.category,
          title: poi.fields.name,
          description: poi.fields.detail_text,
          fastpass: false,
          original: poi,
          area: poi.fields.empire,
          image_url: `https://efteling.com/${poi.fields.image_detailview1 ?? poi.fields.image}`,
          entrance: {
            world: {
              lat: parseFloat(poi.fields.latlon.split(",")[0]),
              lng: parseFloat(poi.fields.latlon.split(",")[1])
            }
          },
          images: images
        }

        return p;
      })
    })
  }

  public getEftelingWaitingTimes(): Promise<EftelingWaitTimesResponse> {
    if (this.waitTimesPromise) {
      return this.waitTimesPromise;
    }

    const p = this.cacheService.remember<EftelingWaitTimesResponse>("efteling_waittimes", environment.CACHE_WAITINGTIMES_SECONDS, () => {
      return this.httpClient.get<EftelingWaitTimesResponse>(`${this.apiUrl}/waittimes`).toPromise();
    });

    this.waitTimesPromise = p;

    return p;
  }

  public getWaitingTimes(): Promise<WaitingTimes[]> {
    return this.getEftelingWaitingTimes().then(value => {
      const rides = value.AttractionInfo.filter(ride => ride.Type == EftelingAttractionInfoType.ATTRACTION);

      return rides.map(ride => {
        let state: WaitingTimesState = WaitingTimesState.CLOSED;

        switch (ride.State) {
          case "open":
            state = WaitingTimesState.OPEN;
            break;
          default:
            break;
        }

        const wait: WaitingTimes = {
          date: Date.now().toString(),
          ride_id: ride.Id,
          state: state,
          wait: ride.WaitingTime,
          original: ride,
        }
        return wait;
      })
    });
  }

  public getWaitingTimesOfRide(rideId: string): Promise<WaitingTimes> {
    return this.getWaitingTimes().then(value => {
      return value.filter(ride => ride.ride_id == rideId.split(`-${this.apiLang}`)[0])[0];
    })
  }
}
