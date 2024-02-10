import {Route} from "@angular/router"
import {HomePageComponent} from "./pages/home-page/home-page.component"
import {NewArticlePageComponent} from "./pages/new-article-page/new-article-page.component"

export const appRoutes: Route[] = [
  {
    path: "",
    component: HomePageComponent,
    pathMatch: "full",
    title: "Главная"
  },
  {
    path: "new",
    component: NewArticlePageComponent,
    title: "Новая статья"
  }
]
