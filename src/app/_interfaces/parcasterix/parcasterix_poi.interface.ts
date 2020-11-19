export interface ParcasterixPoi {
  title: string;
  order: number;
  code: number;
  changed: number;
  translations: {
    fr: number,
    es: number,
    nl: number,
    en: number
  };
  new: boolean;
  point_photo: boolean;
  acces_pass_peur: boolean;
  slider_images: string[];
  description: string;
  best: boolean;
  coupe_file: boolean;
  summary: string;
  latitude: string;
  longitude: string;
  header: string;
  thumbnail: string;
  thumbnail_v2: string;
  header_v2: string;
  feature: {
    icon: string;
    label: string;
    value: string
  }[];
  experience: string;
  mapid: number;
}
