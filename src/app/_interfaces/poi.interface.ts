import {WaitingTimes} from './waitingtimes.interface';

export interface Poi {
  id: string;
  category: PoiCategory;
  original_category: string;
  title: string;
  description?: string;
  area?: string;
  createdAt?: string;
  entrance?: {
    id?: string,
    world?: {
      lat: number,
      lng: number
    },
    map?: {
      lat: number,
      lng: number
    }
  };
  exit?: {
    id?: string,
    world?: {
      lat: number,
      lng: number
    },
    map?: {
      lat: number,
      lng: number
    }
  };
  maxAge?: string;
  maxSize?: string;
  minAge?: number;
  minSize?: number;
  minSizeEscort?: number;
  tags?: string[];
  image_url?: string;
  website_url?: string;
  fastpass?: boolean;
  featured?: boolean;
  photoPoint?: boolean;

  images?: string[];

  waitingTimes?: WaitingTimes;

  // The original POI object (eftelingPoi, parcAsterixPoi, ...)
  original: any;
}

export enum PoiCategory {
  ATTRACTION = 'ATTRACTION',
  BAR = 'BAR',
  RESTAURANT = 'RESTAURANT',
  SERVICE = 'SERVICE',
  TOILETS = 'TOILETS',
  HOTEL = 'HOTEL',
  HOTEL_BAR = 'HOTEL_BAR',
  HOTEL_RESTAURANT = 'HOTEL_RESTAURANT',
  SHOW = 'SHOW',
  SHOP = 'SHOP',
  EVENT_LOCATION = 'EVENT_LOCATION',
  UNDEFINED = 'UNDEFINED',
  GAME = 'GAME',
  POOL = 'POOL',
  FIRSTAID = 'FIRSTAID',
}
