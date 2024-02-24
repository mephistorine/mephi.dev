import {DOCUMENT} from "@angular/common"
import {ChangeDetectionStrategy, Component, inject} from "@angular/core"
import {FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {injectPocketbaseClient, PocketbaseClient} from "@mephi-blog/shared/util-pocketbase"

@Component({
  selector: "mephi-login-page",
  standalone: true,
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.css",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable
  private readonly router: Router = inject(Router)
  private readonly pocketbaseClient: PocketbaseClient = injectPocketbaseClient()
  private readonly document = inject(DOCUMENT)

  protected readonly form = this.fb.group({
    username: this.fb.control<string>("mephi", [Validators.required]),
    password: this.fb.control<string>("1234567890", [Validators.required]),
  })

  protected onSubmitForm(): void {
    if (this.form.invalid) {
      return
    }

    const {username, password} = this.form.value as {username: string; password: string}

    this.pocketbaseClient
      .collection("users")
      .authWithPassword(username, password)
      .then(() => {
        this.document.cookie = this.pocketbaseClient.authStore.exportToCookie({
          secure: true,
          expires: new Date(2038, 0, 1, 23, 59, 59),
          httpOnly: false
        })

        return this.router.navigateByUrl("/")
      })
  }
}
