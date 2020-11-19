export interface PhantasialandPoi {
  area: string;
  category: string;
  createdAt: string;
  description: string;
  entrance: {
    id: string,
    world: {
      lat: number,
      lng: number
    },
    map: {
      lat: number,
      lng: number
    }
  };
  exit: string;
  id: number;
  maxAge: string;
  maxSize: string;
  minAge: number;
  minSize: number;
  minSizeEscort: number;
  navigationEnabled: boolean;
  parkMonitorReferenceName: string;
  poiNumber: number;
  preferredDestinations: [];
  seasons: string[];
  slug: string;
  tagline: string;
  tags: string[];
  title: string;
  titleImage: {
    id: number,
    url: string
  };
  updatedAt: string;
  weblink: string;
}
