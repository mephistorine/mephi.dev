import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {Resource} from "@mephi-blog/shared/util-common"
import {fromNullable, Maybe} from "@sweet-monads/maybe"
import type {ListResult} from "pocketbase"
import {map, Observable} from "rxjs"
import {Article, ARTICLE_FIELDS} from "../entites/article"

@Injectable()
export class GetArticleBySlugResource implements Resource<string, Maybe<Article>> {
  private readonly httpClient: HttpClient = inject(HttpClient)

  public execute(slug: string): Observable<Maybe<Article>> {
    return this.httpClient.get<ListResult<Article>>("/api/collections/articles/records", {
      params: {
        fields: ARTICLE_FIELDS.join(","),
        filter: `slug = '${slug}'`
      }
    }).pipe(
      map((response) => fromNullable(response.items[0]))
    )
  }
}
