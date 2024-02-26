import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http"
import {APP_INITIALIZER, ApplicationConfig, inject} from "@angular/core"
import {provideClientHydration, withHttpTransferCacheOptions} from "@angular/platform-browser"
import {provideRouter, withComponentInputBinding} from "@angular/router"
import {authInterceptor} from "@mephi-blog/article/domain"
import {AuthService} from "@mephi-blog/auth"
import {pocketbaseApiInterceptor} from "@mephi-blog/shared/util-common"
import {providePocketbaseClientOptions} from "@mephi-blog/shared/util-pocketbase"
import {injectCookieString} from "@mephi-blog/shared/util-ssr"
import {provideMicroSentry} from "@micro-sentry/angular"
import {BreadcrumbsPlugin} from "@micro-sentry/breadcrumbs-plugin"
import {NG_EVENT_PLUGINS} from "@tinkoff/ng-event-plugins"
import {appRoutes} from "./app.routes"

function pocketbaseClientAuthFactory() {
  const cookieString = injectCookieString()
  const authService = inject(AuthService)

  return async () => {
    authService.loadFromCookie(cookieString)
    try {
      if (authService.isValid) {
        await authService.authRefresh()
      }
    } catch (_) {
      authService.clear()
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({})
    ),
    provideRouter(appRoutes, withComponentInputBinding()),
    providePocketbaseClientOptions({
      baseUrl: "http://localhost:8090"
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        pocketbaseApiInterceptor,
        authInterceptor
      ])
    ),
    NG_EVENT_PLUGINS,
    {
      provide: APP_INITIALIZER,
      useFactory: pocketbaseClientAuthFactory,
      multi: true
    },
    // TODO: Setup sentry
    provideMicroSentry({
      dsn: "",
      plugins: [BreadcrumbsPlugin]
    })
  ]
}
