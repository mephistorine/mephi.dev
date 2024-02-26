import {HttpInterceptorFn} from "@angular/common/http"
import {inject} from "@angular/core"
import {POCKETBASE_CLIENT_OPTIONS, PocketbaseClientOptions} from "@mephi-blog/shared/util-pocketbase"

export const pocketbaseApiInterceptor: HttpInterceptorFn = (req, next) => {
  const pocketbaseOptions: PocketbaseClientOptions = inject(POCKETBASE_CLIENT_OPTIONS)

  if (req.url.startsWith("/api")) {
    return next(req.clone({
      url: `${pocketbaseOptions.baseUrl}${req.url}`
    }))
  }

  return next(req)
}
