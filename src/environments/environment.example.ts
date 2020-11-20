// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 'v1.0',

  // The amount of seconds POIs are cached (defaults to 60 minutes)
  CACHE_POIS_SECONDS: 60 * 60,

  // The amount of seconds waiting times are cached (defaults to 60 minutes)
  CACHE_WAITINGTIMES_SECONDS: 60 * 60,

  // The shared API for themeparks, to circumvent CORS rules and some other browser issues
  SHARED_API_URL: 'http://127.0.0.1:8000/api',

  // The shared data endpoint for themeparks for static data, to circumvent CORS rules and some other browser issues
  SHARED_DATA_URL: 'http://127.0.0.1:8000/api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
