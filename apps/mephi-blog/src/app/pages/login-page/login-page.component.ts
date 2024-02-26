import {DOCUMENT} from "@angular/common"
import {ChangeDetectionStrategy, Component, DestroyRef, inject} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {AuthService} from "@mephi-blog/auth"
import {take, tap} from "rxjs"

@Component({
  selector: "mephi-login-page",
  standalone: true,
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.css",
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly fb: NonNullableFormBuilder = inject(NonNullableFormBuilder)
  private readonly router: Router = inject(Router)
  private readonly authService: AuthService = inject(AuthService)
  private readonly document = inject(DOCUMENT)
  private readonly destroyRef = inject(DestroyRef)

  protected readonly form = this.fb.group({
    username: this.fb.control<string>("mephi", [Validators.required]),
    password: this.fb.control<string>("1234567890", [Validators.required])
  })

  protected onSubmitForm(): void {
    if (this.form.invalid) {
      return
    }

    const {username, password} = this.form.value as {username: string; password: string}

    this.authService
      .authWithPassword(username, password)
      .pipe(
        take(1),
        tap(() => {
          this.document.cookie = this.authService.exportToCookie()
          this.router.navigateByUrl("/")
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe()
  }
}
