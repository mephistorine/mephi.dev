import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {POCKETBASE_COOKIE_KEY} from "@mephi-blog/shared/util-pocketbase"
import {User, USER_FIELDS} from "@mephi-blog/user/domain"
import {fromNullable, just, Maybe, none} from "@sweet-monads/maybe"
import {cookieParse, cookieSerialize, isTokenExpired} from "pocketbase"
import {firstValueFrom, tap} from "rxjs"

type AuthResponse = {
  readonly token: string
  readonly record: User
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private readonly httpClient = inject(HttpClient)

  private token = none<string>()
  private user = none<User>()

  public get isValid(): boolean {
    return this.token.isJust() && this.token.map(isTokenExpired).unwrap()
  }

  constructor() {
  }

  public getToken(): Maybe<string> {
    return this.token
  }

  public getUser(): Maybe<User> {
    return this.user
  }

  public authWithPassword(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(`/api/collections/users/auth-with-password`, {
      identity: username,
      password
    }).pipe(
      tap((response: AuthResponse) => this.save(response.token, response.record))
    )
  }

  public loadFromCookie(cookieString: string): void {
    const data = fromNullable(cookieParse(cookieString)[POCKETBASE_COOKIE_KEY])

    if (data.isNone()) {
      return
    }

    this.token = fromNullable(data.unwrap().token)
    this.user = fromNullable(data.unwrap().model)
  }

  public exportToCookie(): string {
    return cookieSerialize(POCKETBASE_COOKIE_KEY, JSON.stringify({
      token: this.token.unwrap(),
      model: this.user.unwrap()
    }), {
      expires: new Date(2038, 0, 1, 23, 59, 59),
      secure: true,
      sameSite: true,
      httpOnly: true,
      path: "/",
    })
  }

  public async authRefresh() {
    return firstValueFrom(this.httpClient.post<AuthResponse>(`/api/collections/users/auth-refresh`, null, {
      params: {
        fields: USER_FIELDS.map(f => `record.${f}`).join(",")
      }
    }))
      .then((result: AuthResponse) => this.save(result.token, result.record))
  }

  public clear(): void {
    this.token = none()
    this.user = none()
  }

  public save(token: string, user: User): void {
    this.token = just(token)
    this.user = just(user)
  }
}
