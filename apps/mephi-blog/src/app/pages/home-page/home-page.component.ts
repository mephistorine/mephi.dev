import {ChangeDetectionStrategy, Component, input} from "@angular/core"
import {RouterLink} from "@angular/router"

@Component({
  selector: "mephi-home-page",
  standalone: true,
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
  imports: [
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  public articles = input.required<any[]>()
}
