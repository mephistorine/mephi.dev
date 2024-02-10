import {Component, computed, forwardRef, inject, SecurityContext, signal} from "@angular/core"
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms"
import {SafeHtml} from "@angular/platform-browser"
import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify"
import {marked} from "marked"

type MarkdownEditorTabName = "SOURCE" | "RESULT" | "BOTH"

const TABS_BY_NAME: Record<MarkdownEditorTabName, string> = {
  SOURCE: "Text",
  RESULT: "Preview",
  BOTH: "Both"
}

@Component({
  selector: "ui-editor",
  standalone: true,
  templateUrl: "./ui-editor.component.html",
  styleUrl: "./ui-editor.component.css",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiEditorComponent),
      multi: true
    }
  ]
})
export class UiEditorComponent implements ControlValueAccessor {
  private readonly ngDompurifySanitizer = inject(NgDompurifySanitizer)

  protected readonly tabsByName = TABS_BY_NAME
  protected readonly tabList = Object.keys(TABS_BY_NAME) as MarkdownEditorTabName[]

  protected readonly value = signal<string>("")
  protected readonly selectedTab = signal<MarkdownEditorTabName>("SOURCE")
  protected readonly isDisabled = signal<boolean>(false)

  protected readonly previewValue = computed<SafeHtml>(() => {
    return this.ngDompurifySanitizer.sanitize(
      SecurityContext.HTML,
      marked(this.value())
    )
  })

  public writeValue(value: string): void {
    if (typeof value !== "string") {
      throw new Error(`${this.constructor.name} accept string`)
    }

    this.value.set(value)
  }

  public registerOnChange(fn: any): void {
    this.changeValue = fn
  }

  public registerOnTouched(fn: any): void {
    this.markAsTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled)
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value)
    this.changeValue(this.value())
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected changeValue(value: string): void {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected markAsTouched(): void {
  }
}
