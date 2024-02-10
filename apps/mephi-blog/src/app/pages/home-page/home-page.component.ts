import {ChangeDetectionStrategy, Component} from "@angular/core"

@Component({
  selector: "mephi-home-page",
  standalone: true,
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
