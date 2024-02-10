import {ComponentFixture, TestBed} from "@angular/core/testing"
import {NewArticlePageComponent} from "./new-article-page.component"

describe("NewArticleComponent", () => {
  let component: NewArticlePageComponent
  let fixture: ComponentFixture<NewArticlePageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewArticlePageComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NewArticlePageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
