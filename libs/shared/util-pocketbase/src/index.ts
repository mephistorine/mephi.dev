import {EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders} from "@angular/core"
import Pocketbase from "pocketbase"

export class PocketbaseClient extends Pocketbase {}

export type PocketbaseClientOptions = {
  baseUrl: string
}

export const POCKETBASE_COOKIE_KEY = "pb_auth"

export const POCKETBASE_CLIENT_DEFAULT_OPTIONS: PocketbaseClientOptions = {
  baseUrl: "http://127.0.0.1:8090",
}

export const POCKETBASE_CLIENT_OPTIONS = new InjectionToken<PocketbaseClientOptions>("__POCKETBASE_CLIENT_OPTIONS__")

export function providePocketbaseClientOptions(options: PocketbaseClientOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: POCKETBASE_CLIENT_OPTIONS,
      useValue: options,
    },
  ])
}

export const POCKETBASE_CLIENT = new InjectionToken<PocketbaseClient>("__POCKETBASE_CLIENT__")

function providePocketbaseClientFactory(): PocketbaseClient {
  const options = inject(POCKETBASE_CLIENT_OPTIONS, {optional: true}) ?? POCKETBASE_CLIENT_DEFAULT_OPTIONS
  return new PocketbaseClient(options.baseUrl)
}

export function providePocketbaseClient(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: POCKETBASE_CLIENT,
      useFactory: providePocketbaseClientFactory,
    },
  ])
}

export function injectPocketbaseClient(): PocketbaseClient {
  return inject(POCKETBASE_CLIENT)
}
