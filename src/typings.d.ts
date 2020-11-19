declare module 'themeparks' {
  export interface Themeparks {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(url: string, queryString?: string): Themeparks;
}
