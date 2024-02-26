import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core"
import {DomSanitizer} from "@angular/platform-browser"
import {RouterLink} from "@angular/router"
import {Article} from "@mephi-blog/article/domain"
import {fromNullable, Maybe} from "@sweet-monads/maybe"
import {marked} from "marked"

@Component({
  selector: "mephi-single-article-page",
  standalone: true,
  templateUrl: "./single-article-page.component.html",
  styleUrl: "./single-article-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink
  ]
})
export class SingleArticlePageComponent {
  private readonly sanitizer = inject(DomSanitizer)

  public article = input.required<Maybe<Article>, Article | null>({
    transform: fromNullable
  })

  protected isEmptyArticle = computed(() => this.article().isNone())

  protected title = computed(() => this.article().unwrap().title)

  protected content = computed(() => this.sanitizer.bypassSecurityTrustHtml(marked(this.article().unwrap().content) as string))
}
