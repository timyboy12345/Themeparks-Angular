export interface OpeningTimes {
  date: string;
  year: number;
  month: number;
  day: number;
  times: OpeningTimesTimeslot[];
  events?: OpeningtimesEvent[];
  original: any;
}

export interface OpeningTimesTimeslot {
  open: string;
  close: string;
}

export interface OpeningtimesEvent {
  title: string;
  description?: string;
  show: boolean;
  type: 'important' | 'informative' | 'event' | 'company';
  begin: string;
  end: string;
}
