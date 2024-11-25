import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRecipePageComponent } from './shared-recipe-page.component';

describe('SharedRecipePageComponent', () => {
  let component: SharedRecipePageComponent;
  let fixture: ComponentFixture<SharedRecipePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedRecipePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedRecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
