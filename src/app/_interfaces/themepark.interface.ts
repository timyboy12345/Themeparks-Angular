import {ThemeparkService} from '../_services/themepark.service';
import {Country} from './country.interface';

export interface Themepark {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  country: Country;
  service?: ThemeparkService;
  enabled: boolean;
}
