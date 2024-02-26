import {HttpInterceptorFn} from "@angular/common/http"
import {inject} from "@angular/core"
import {AuthService} from "@mephi-blog/auth"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  if (authService.isValid && req.url.startsWith("/api")) {
    return next(req.clone({
      headers: req.headers.set("Authorization", authService.getToken().unwrap())
    }))
  }

  return next(req)
}
