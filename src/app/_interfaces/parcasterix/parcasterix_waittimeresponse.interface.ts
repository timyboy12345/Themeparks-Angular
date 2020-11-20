export interface ParcAsterixWaitTimeResponse {
  code: 0,
  latency: {
    latency: {
      attractionid: string,
      latency: 'OUVERT' | 'FERMER',
      closing_time: string
    }[]
  }
}
