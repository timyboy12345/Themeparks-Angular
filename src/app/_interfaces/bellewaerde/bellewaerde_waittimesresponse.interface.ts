export interface BellewaerdeWaitTimesResponse {
  id: string;
  open: string;
  close: string;
  wait: number;
  shows: BellewaerdeWaitTimeResponseShowTimes[];
}

export interface BellewaerdeWaitTimeResponseShowTimes {
  start: string;
  duration: number;
}
