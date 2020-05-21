import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsComponent } from './controls.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
