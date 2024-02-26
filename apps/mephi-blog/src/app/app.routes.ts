import {ErrorHandler, inject} from "@angular/core"
import {ActivatedRouteSnapshot, CanActivateFn, Route, Router} from "@angular/router"
import {GetAllArticlesResource, GetArticleBySlugResource} from "@mephi-blog/article/domain"
import {AuthService} from "@mephi-blog/auth"
import {fromNullable} from "@sweet-monads/maybe"
import {catchError, of} from "rxjs"
import {HomePageComponent} from "./pages/home-page/home-page.component"
import {LoginPageComponent} from "./pages/login-page/login-page.component"
import {NewArticlePageComponent} from "./pages/new-article-page/new-article-page.component"
import {NotFoundErrorPageComponent} from "./pages/not-found-error-page/not-found-error-page.component"
import {SingleArticlePageComponent} from "./pages/single-article-page/single-article-page.component"

const canCreateArticle: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isValid
    && authService.getUser()
      .map(u => u.scopes.includes("CAN_CREATE_ARTICLE"))
      .unwrap()) {
    return true
  }

  return router.parseUrl("/")
}

export const appRoutes: Route[] = [
  {
    path: "",
    component: HomePageComponent,
    pathMatch: "full",
    title: "Главная",
    resolve: {
      articles: () => {
        const errorHandler = inject(ErrorHandler)
        return inject(GetAllArticlesResource).execute().pipe(
          catchError((error) => {
            errorHandler.handleError(error)
            return of([])
          })
        )
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
    title: "Авторизация"
  },
  {
    path: "articles/:slug",
    component: SingleArticlePageComponent,
    title: "Статья",
    resolve: {
      article: (route: ActivatedRouteSnapshot) => {
        const errorHandler = inject(ErrorHandler)
        const slug = fromNullable(route.paramMap.get("slug"))
        return inject(GetArticleBySlugResource).execute(slug.unwrap()).pipe(
          catchError((error) => {
            errorHandler.handleError(error)
            return of(null)
          })
        )
      }
    }
  },
  {
    path: "**",
    component: NotFoundErrorPageComponent,
    title: "Такой страницы нет"
  }
]
