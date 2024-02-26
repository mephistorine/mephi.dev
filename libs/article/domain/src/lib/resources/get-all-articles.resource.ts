import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {Resource} from "@mephi-blog/shared/util-common"
import type {ListResult} from "pocketbase"
import {map, Observable} from "rxjs"
import {Article, ARTICLE_FIELDS} from "../entites/article"

@Injectable()
export class GetAllArticlesResource implements Resource<void, readonly Article[]> {
  private readonly httpClient: HttpClient = inject(HttpClient)

  public execute(): Observable<readonly Article[]> {
    return this.httpClient.get<ListResult<Article>>("/api/collections/articles/records", {
      params: {
        fields: ARTICLE_FIELDS.join(","),
        sort: "created"
      }
    }).pipe(
      map((response) => response.items)
    )
  }
}
