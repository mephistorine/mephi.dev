import {ChangeDetectionStrategy, Component, DestroyRef, inject, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {CreateArticleResource} from "@mephi-blog/article/domain"
import {AuthService} from "@mephi-blog/auth"
import {UiEditorComponent} from "@mephi-blog/shared/ui-editor"
import {finalize, take} from "rxjs"
import slug from "slug"

const TEST_MARKDOWN = `Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option above to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

![](https://www.petsmopolitan.com/wp-content/uploads/2021/08/do-parrots-need-a-companion.jpg)

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/
`

@Component({
  selector: "mephi-new-article-page",
  standalone: true,
  templateUrl: "./new-article-page.component.html",
  styleUrl: "./new-article-page.component.css",
  imports: [UiEditorComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {ngSkipHydration: "true"}
})
export class NewArticlePageComponent {
  private readonly formBuilder: NonNullableFormBuilder = inject(NonNullableFormBuilder)
  private readonly createArticleResource: CreateArticleResource = inject(CreateArticleResource)
  private readonly destroyRef: DestroyRef = inject(DestroyRef)
  private readonly authService: AuthService = inject(AuthService)

  protected readonly isLoading = signal(false)

  protected readonly form = this.formBuilder.group({
    title: ["", [Validators.required]],
    content: [TEST_MARKDOWN, [Validators.required]]
  })

  protected onSubmitForm(): void {
    const {title, content} = this.form.value as {title: string; content: string}
    const user = this.authService.getUser().unwrap()

    this.isLoading.set(true)
    this.createArticleResource
      .execute({
        title,
        content,
        slug: slug(title),
        userId: user.id
      })
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }
}
