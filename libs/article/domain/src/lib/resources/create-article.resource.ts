import {HttpClient} from "@angular/common/http"
import {inject, Injectable} from "@angular/core"
import {Resource} from "@mephi-blog/shared/util-common"
import {Observable} from "rxjs"
import {Article, ARTICLE_FIELDS} from "../entites/article"

export type CreateArticleResourcePayload = {
  userId: string
  title: string
  slug: string
  content: string
}

@Injectable()
export class CreateArticleResource implements Resource<CreateArticleResourcePayload, Article> {
  private readonly httpClient: HttpClient = inject(HttpClient)

  public execute(payload: CreateArticleResourcePayload): Observable<Article> {
    return this.httpClient.post<Article>("/api/collections/articles/records", payload, {
      params: {
        fields: ARTICLE_FIELDS.join(","),
        sort: "created"
      }
    })
  }
}
