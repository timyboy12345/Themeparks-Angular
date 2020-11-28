// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 'v1.0',

  // The amount of seconds POIs are cached (defaults to 60 minutes)
  CACHE_POIS_SECONDS: 60 * 60,

  // The amount of seconds waiting times are cached (defaults to 60 minutes)
  CACHE_WAITINGTIMES_SECONDS: 60 * 5,

  // The amount of seconds opening times are cached (defaults to 30 minutes)
  CACHE_OPENINGTIMES_SECONDS: 60 * 30,

  // The shared API for themeparks, to circumvent CORS rules and some other browser issues
  SHARED_API_URL: 'http://127.0.0.1:8000/api',

  // The URL where authorization and user data is stored
  API_URL: 'http://127.0.0.1:8000',

  // The URL of this Angular app
  APP_URL: 'http://themeparks.arendz.nl/#',

  // The public key of the Themeparks OAUTH Api
  OAUTH_PUBLIC_KEY: '9218a68f-0524-45a6-b3dc-51cbb93774c7',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
