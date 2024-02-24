import {ActivatedRouteSnapshot, CanActivateFn, Route} from "@angular/router"
import {injectPocketbaseClient} from "@mephi-blog/shared/util-pocketbase"
import {HomePageComponent} from "./pages/home-page/home-page.component"
import {LoginPageComponent} from "./pages/login-page/login-page.component"
import {NewArticlePageComponent} from "./pages/new-article-page/new-article-page.component"
import {SingleArticleComponent} from "./pages/single-article/single-article.component"

const canCreateArticle: CanActivateFn = () => {
  const pocketbaseClient = injectPocketbaseClient()
  return pocketbaseClient.authStore.isValid
}

export const appRoutes: Route[] = [
  {
    path: "",
    component: HomePageComponent,
    pathMatch: "full",
    title: "Главная",
    resolve: {
      articles: () => {
        const pocketbaseClient = injectPocketbaseClient()
        return pocketbaseClient.collection("articles").getFullList({
          fields: "id,slug,title,content"
        })
      }
    }
  },
  {
    path: "new",
    component: NewArticlePageComponent,
    title: "Новая статья",
    canActivate: [canCreateArticle]
  },
  {
    path: "login",
    component: LoginPageComponent,
    title: "Авторизация",
  },
  {
    path: "articles/:slug",
    component: SingleArticleComponent,
    resolve: {
      article: async (route: ActivatedRouteSnapshot) => {
        const pocketbaseClient = injectPocketbaseClient()
        const slug = route.paramMap.get("slug")
        return await pocketbaseClient.collection("articles").getFirstListItem(`slug = '${slug}'`, {
          fields: "id,slug,title,content"
        })
      }
    },
    title: "Статья"
  }
]
