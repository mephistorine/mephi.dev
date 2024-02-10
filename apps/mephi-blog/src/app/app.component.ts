import {Component} from "@angular/core"
import {RouterModule} from "@angular/router"

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: "mephi-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent {
}
