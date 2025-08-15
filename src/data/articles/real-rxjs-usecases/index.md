---
title: Практическое руководство по RxJS
description: В этой статье я показываю практические примеры использования RxJS, в частности такие сущности как Observable, Subject, EMPTY. А так же операторы interval, timer, repeat, shareReplay, withLatestFrom.
category: frontend
tags:
  - rxjs
  - typescript
publishDate: 2025-08-15
poster:
    url: ./poster.jpg
    alt: sdsd
    author:
        name: Willian Justen de Vasconcellos
        url: https://unsplash.com/@willianjusten
---

# Создание потоков

## Observable

Чаще всего RxJS используют когда у вас есть какая-то последовательность асинхронных, но это не обязательно, данных. Например, события клика по кнопке, или событие `message` из WebSocket соединения. То есть то, что часто не имеет видимого конца и происходит асинхронно, мы ведь не знаем когда именно пользователь кликнет по кнопке.

Следующий код создает поток данных из события клика по кнопке.

```ts
import {Observable} from "rxjs"

const events$ = new Observable((observer) => {
	// Находим кнопку в DOM
	const button = document.querySelector("button")
	// Создает контроллер, чтобы удобнее удалять слушателя
	const abortController = new AbortController()
	
	button.addEventListener(
		"click",
		(event) => {
			observer.next(event)
		},
		{signal: abortController.signal}
	)
	
	/* Всегда стоит помнить об уничтожении подписок.
	Функция которую мы вернем будет вызвана при уничтожении
	подписки на этот поток. В ней мы можем описать лубую
	логику освобождения памяти */
	return () => {
		abortController.abort()
	}
})

/* Метод subscribe возвращает объект подписки. */
const subscription = events$.subscribe((event) => {
	console.log(event)
})

setTimeout(() => {
	/* Нужно обязательно уничтожать подписку,
	чтобы не было утечек памяти. В данном случае
	мы уничтожаем подписку через 5 секунд. Но в реальном
	приложении это будет происходить по какому-то событию.
	Например, при уничтожении компонента. */
	subscription.unsubscribe()
}, 5000)
```

Чтобы не писать столько кода каждый раз, разработчики rxjs вынесли типовые решения в отдельные функции, например создать поток событий клика по кнопке можно сделать следующим образом:

```ts
import {fromEvent} from "rxjs/operators"

const button = document.querySelector("button")

const events$ = fromEvent(button, "click")

const subscription = events$.subscribe((event) => {
	console.log(event)
})

setTimeout(() => {
	subscription.unsubscribe()
}, 5000)
```

С помощью класса Observable, вы можете создавать потоки, на которые можно потом подписаться и получать значения, ниже несколько примеров использования:

### Геопозиция пользователя:

```ts
import {Observable} from "rxjs"

function fromWatchGeoPosition(options) {
	return new Observable((observer) => {
		const watchId = navigator.geolocation.watchPosition(
			(position) => {
				observer.next(position)
			},
			(error) => {
				observer.error(error)
			},
			options
		)
		
		return () => {
			navigator.geolocation.clearWatch(watchId)
		}
	})
}

const geoPositions$ = fromWatchGeoPosition({
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
})

geoPositions$.subscribe((position) => console.log(position))
```

### **window.matchMedia**:

```ts
import {Observable} from "rxjs"
import {fromEvent} from "rxjs/operators"

function fromMatchMedia(mediaQuery: string) {
	return new Observable((observer) => {
		const mql = window.matchMedia(mediaQuery)
		observer.next(mql.matches)
		
		const subscription = fromEvent(mql, "change").subscribe((event) => {
			observer.next(event.matches)
		})
		
		return () => {
			subscription.unsubscribe()
		}
	})
}

const media$ = fromMatchMedia("(max-width: 600px)")
media$.subscribe((isMatches) => console.log(isMatches))
```

## BehaviorSubject

Чаще всего `BehaviorSubject` используется для реактивного локального стейта.

```ts
@Component({
	selector: "app-user",
	template: `
		<h1>{{ userName$ | async }}</h1>
		<p>{{ userAge$ | async }}</p>
	`
})
class UserComponent {
	private user$ = new BehaviorSubject({
		name: "",
		age: 0
	})
	
	userName$ = this.user$.pipe(
		map((user) => user.name)
	)
	
	userAge$ = this.user$.pipe(
		map((user) => user.age)
	)
	
	@Input()
	set user(value) {
		this.user$.next(value)
	}
}
```

Так как это обычный класс, то его можно расширять. Например вот так:

```ts
// Это упрощенный код из библиотеки Taiga UI
// <https://github.com/taiga-family/taiga-ui/blob/2a558e0d39ef76a009aaca7430e25bc83da87f5a/projects/addon-doc/services/theme.service.ts>

@Injectable({
    providedIn: 'root',
})
export class TuiThemeService extends BehaviorSubject<string> {
    constructor() {
        super(window.localStorage.getItem(key) || "dark");
    }

    override next(theme: string): void {
        window.localStorage.setItem(this.key, theme);
        super.next(theme);
    }
}
```

И так как это сервис, его можно инжектить как обычно.

## Subject

Обычно Subject используют в качестве [шины данных](https://ru.wikipedia.org/wiki/%D0%A8%D0%B8%D0%BD%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85). Например, какое-нибудь событие.

### Шина событий

За хорошим примером далеко ходить не надо, поток `events` у `AbstractControl` от которого наследуются все форм контролы, является Subject-ом и `valueChanges` тоже.

### Использование в связке с takeUntil

```ts
@Component({...})
class UserComponent implements OnInit, OnDestroy {
	private destroy$ = new Subject<void>()
	
	ngOnInit() {
		interval(5000)
			.pipe(takeUntil(this.destroy$))
			.subscribe(console.log)
	}
	
	ngOnDestroy() {
		this.destroy$.next()
	}
}
```

Тут для примера используется interval, но может быть любая логика, которая актуальна только пока компонент жив. Так что через takeUntil можно удобно уничтожать подписки.

## interval и timer

Главное отличие interval-а от timer-а это то, что в timer можно указать задержку для первоначального эмита. Например:

```ts
// Отправит первое значение сразу и следующиее через каждые 10 секунд после подписки
timer(0, 10_000).subscribe(console.log)

// Отправит первое значение через 10 секунд после подписки
interval(10_000).subscribe(console.log)
```

interval это частное timer-а. Просто у задержка и сам интервал равны.

### Обновлять данные раз в n-ое количество секунд

Например, у нас есть дашборд со всякими графиками предприятия, эту страницу открывают на настенном мониторе в офисе и ее нужно обновлять раз в 10 минут.

```ts
timer(0, 10 * 60 * 1000).pipe(
	switchMap(() => httpClient.get("/api/charts-data"))
).subscribe(console.log)
```

## EMPTY

Это поток который уже закомличен и как только на этот поток подпишутся, то подписка сразу уничтожится.

В основном этот поток используется для сохранения интерфейса, давайте на примере. Представим у нас есть функция, которая создает из метода `matchMedia` поток, и если у нас SSR приложение, то эта функция сломается, так как на сервере нет `window`.

Чтобы этого избежать можно пойти двумя путями:

### Вернуть null

Но в таком случае нам придется писать проверку, каждый раз когда ее используем, а это очень не удобно.

```ts
const media$ = fromMatchMedia("(max-width: 600px)")

if (media$ !== null) {
	media$.subscribe((isMatches) => console.log(isMatches))
}
```

### Вернуть EMPTY

```ts
import {Observable, EMPTY} from "rxjs"
import {fromEvent} from "rxjs/operators"

function fromMatchMedia(mediaQuery: string) {
	if (typeof window?.matchMedia === "undefined") {
		return EMPTY // [!code highlight]
	}
	
	return new Observable((observer) => {
		const mql = window.matchMedia(mediaQuery)
		observer.next(mql.matches)
		
		const subscription = fromEvent(mql, "change").subscribe((event) => {
			observer.next(event.matches)
		})
		
		return () => {
			subscription.unsubscribe()
		}
	})
}

const media$ = fromMatchMedia("(max-width: 600px)")
media$.subscribe((isMatches) => console.log(isMatches))
```

В таком случае, у нас не изменяется тот самый интерфейс взаимодействия, что очень удобно. Но если все таки нам надо что-то вернуть если поток завершился без каких либо значений, то для этого можно использовать специальный оператор `defaultIfEmpty`.

```ts
const media$ = fromMatchMedia("(max-width: 600px)").pipe(
	defaultIfEmpty(false)
)
media$.subscribe((isMatches) => console.log(isMatches))
```

# Обработка данных потока

## shareReplay

Оператор позволяет реализовать своего рода локальный кеш. Например, у нас есть поток из HTTP запроса с данными о пользователе.

```ts
@Component({
	template: `
		<h1>{{userName$ | async}}</h1>
		<span>{{userAge$ | async}}</span>
	`
})
class UserComponent {
	private httpClient = inject(HttpClient)
	
	private user$ = this.httpClient.get("/api/users/current")
	
	userName$ = this.user$.pipe(
		map(user => user.fullName)
	)
	
	userAge$ = this.user$.pipe(
		map(user => user.age)
	)
}
```

В этом случае для обоих потоков будет два HTTP запроса, что не очень хорошо. Так что давайте исправим это:

```ts
@Component({...})
class UserComponent {
	// ...
	private user$ = this.httpClient.get("/api/users/current").pipe(
		shareReplay({
			bufferCount: 1,
			refCount: true
		})
	)
	// ...
}
```

С этим оператором запрос будет один, он отправится при первой подписке. Следующим подписчикам будут отдавать уже полученное ранее значение (закешированное).

Теперь давайте разберемся с параметрами как именно работает этот оператор.

- `bufferCount` — количество значений, которые нужно закешировать. Например, если будет 3, то для каждого подписчика будет воспроизводиться 3 последних значения
- `refCount` — shareReplay подсчитывает количество подписчиков, и если значение в `true`, то при отписке всех подписчиков, кеш инвалидируется, так что при следующем появлении новых подписчиков HTTP запрос будет выполнен еще раз. По умолчанию `false`.

## withLatestFrom

Чаще всего используется во время выполнения одного потока, для получения данных из другого потока.

Возьмем для примера все тот же UserComponent:

```ts
@Component({...})
class UserComponent {
	// ...
	
	constructor() {
		fromEvent(document.querySelector("button"), "click").pipe(
			withLatestFrom(this.user$),
			tap(([event, user]) => console.log(event, user))
		).subscribe()
	}
}
```

## repeat

### Перезапуск таймера

Этот оператор легко недооценить. Давайте для начала взглянем на код из Taiga UI. А точнее на компонент [TuiAlertComponent](https://github.com/taiga-family/taiga-ui/blob/9bd822136cf2b1cf62d9ab513774a8bfea2a4260/projects/core/components/alert/alert.component.ts#L36). Ниже приведу его упрощенную версию.

```ts
export class TuiAlertComponent implements OnInit {
	el = inject(ElementRef)
	
	close() {
	  // ...
	}

	ngOnInit() {
		timer(3000).pipe(
			takeUntil(fromEvent(this.el.nativeElement, 'mouseenter')),
			repeat({delay: () => fromEvent(this.el.nativeElement, 'mouseleave')}),
			takeUntil(this.destroy$)
		).subscribe(() => this.close())
	}
}
```

Как это работает: При создании компонента запускается таймер, который через три секунды, должен закрыть алерт. Но если вы наведете на алерт курсор, то таймер остановится (на самом деле поток уничтожится), но как только вы уберете мышку поток снова оживет и таймер запустится заново, за это как раз отвечает repeat.

Как вы понимаете `delay` возвращает поток, next, которого перезапускает внешний поток заново.

### Перезапуск HTTP запроса

Допустим у нас есть все тот же UserComponent из примеров выше. Представим у пользователя есть кнопка Update. По ее нажатию мы должно снова сделать HTTP запрос за данными пользователя и показать их.

С помощью repeat это делать очень просто.

```ts
@Component({...})
class UserComponent {
	// ...
	refresh$ = new Subject<void>();
	
	private user$ = this.httpClient.get("/api/users/current").pipe(
		repeat({delay: () => this.refresh$}),
		shareReplay({
			bufferCount: 1,
			refCount: true
		})
	)
	
	refresh() {
		this.refresh$.next()
	}
	// ...
}
```
