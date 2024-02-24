import {DOCUMENT, isPlatformBrowser} from "@angular/common"
import {inject, InjectionToken, PLATFORM_ID} from "@angular/core"

export const REQUEST = new InjectionToken<any>("__REQUEST__")

export function injectCookieString(): string {
  const platformId = inject(PLATFORM_ID)
  const document = inject(DOCUMENT, {optional: true})
  const request = inject(REQUEST, {optional: true})

  return isPlatformBrowser(platformId)
    ? document!.cookie
    : request!.headers.cookie
}
