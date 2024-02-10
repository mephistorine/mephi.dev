import {ApplicationConfig} from "@angular/core"
import {provideClientHydration, withHttpTransferCacheOptions} from "@angular/platform-browser"
import {provideRouter} from "@angular/router"
import {NG_EVENT_PLUGINS} from "@tinkoff/ng-event-plugins"
import {appRoutes} from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true
      })
    ),
    provideRouter(appRoutes),
    NG_EVENT_PLUGINS
  ]
}
