import {ComponentFixture, TestBed} from "@angular/core/testing"
import {UiEditorComponent} from "./ui-editor.component"

describe("SharedUiEditorComponent", () => {
  let component: UiEditorComponent
  let fixture: ComponentFixture<UiEditorComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiEditorComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UiEditorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
