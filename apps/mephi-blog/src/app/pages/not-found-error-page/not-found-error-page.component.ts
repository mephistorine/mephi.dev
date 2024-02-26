import {CommonModule} from "@angular/common"
import {ChangeDetectionStrategy, Component} from "@angular/core"

@Component({
  selector: "mephi-not-found-error-page",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./not-found-error-page.component.html",
  styleUrl: "./not-found-error-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundErrorPageComponent {}
