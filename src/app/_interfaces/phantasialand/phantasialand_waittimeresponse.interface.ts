export interface PhantasialandWaitTimeResponse {
  open: boolean;
  poiId: number;
  closing: string;
  opening: string;
  showTimes: string[];
  waitTime: number;
  updatedAt: string;
  messages: PhantasialandLocalizedWaittimeItem;
  _primaryText: { de: string };
  _secondaryText: PhantasialandLocalizedWaittimeItem;
  createdAt: string;
  updatedRow: string;
}

export interface PhantasialandLocalizedWaittimeItem {
  de: string;
  en: string;
  fr: string;
  nl: string;
}
