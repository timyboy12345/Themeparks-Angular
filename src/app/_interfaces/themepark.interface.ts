import {ThemeparkService} from '../_services/themepark.service';
import {Country} from './country.interface';
import {ThemeparkOptions} from './themepark_options.interface';

export interface Themepark {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  country: Country;
  service?: ThemeparkService;
  enabled: boolean;
  options?: ThemeparkOptions;
  lat?: number;
  lng?: number;
}
