export interface ShowTimes {
  duration?: number;
  allShowTimes: ShowTime[];
  todayShowTimes: ShowTime[];
  otherDateShowTimes?: ShowTime[];
  pastShowTimes: ShowTime[];
  futureShowTimes: ShowTime[];
}

export interface ShowTime {
  id?: string;
  from: string;
  to?: string;
  duration?: number;
}
