import {APP_INITIALIZER, ApplicationConfig} from "@angular/core"
import {provideClientHydration, withHttpTransferCacheOptions} from "@angular/platform-browser"
import {provideRouter, withComponentInputBinding} from "@angular/router"
import {
  injectPocketbaseClient,
  POCKETBASE_COOKIE_KEY,
  providePocketbaseClient
} from "@mephi-blog/shared/util-pocketbase"
import {injectCookieString} from "@mephi-blog/shared/util-ssr"
import {NG_EVENT_PLUGINS} from "@tinkoff/ng-event-plugins"
import {appRoutes} from "./app.routes"

function pocketbaseClientAuthFactory() {
  const pocketbaseClient = injectPocketbaseClient()
  const cookieString = injectCookieString()

  return async () => {
    pocketbaseClient.authStore.loadFromCookie(cookieString, POCKETBASE_COOKIE_KEY)

    try {
      if (pocketbaseClient.authStore.isValid) {
        await pocketbaseClient.collection("users").authRefresh()
      }
    } catch (e) {
      pocketbaseClient.authStore.clear()
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideRouter(appRoutes, withComponentInputBinding()),
    providePocketbaseClient(),
    NG_EVENT_PLUGINS,
    {
      provide: APP_INITIALIZER,
      useFactory: pocketbaseClientAuthFactory,
      multi: true
    }
  ],
}
