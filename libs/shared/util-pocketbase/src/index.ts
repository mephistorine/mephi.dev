import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from "@angular/core"

export type PocketbaseClientOptions = {
  baseUrl: string
}

export const POCKETBASE_COOKIE_KEY = "pb_auth"

export const POCKETBASE_CLIENT_OPTIONS = new InjectionToken<PocketbaseClientOptions>("__POCKETBASE_CLIENT_OPTIONS__")

export function providePocketbaseClientOptions(options: PocketbaseClientOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: POCKETBASE_CLIENT_OPTIONS,
      useValue: options
    }
  ])
}
