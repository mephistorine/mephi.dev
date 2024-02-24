import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core"
import {DomSanitizer} from "@angular/platform-browser"
import {marked} from "marked"

@Component({
  selector: "mephi-single-article",
  standalone: true,
  templateUrl: "./single-article.component.html",
  styleUrl: "./single-article.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleArticleComponent {
  private readonly sanitizer = inject(DomSanitizer)

  public article = input.required<any>()

  protected title = computed(() => this.article().title)

  protected content = computed(() => this.sanitizer.bypassSecurityTrustHtml(marked(this.article().content) as string))
}
