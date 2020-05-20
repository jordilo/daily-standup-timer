import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSettingsComponent } from './quick-settings.component';

describe('QuickSettingsComponent', () => {
  let component: QuickSettingsComponent;
  let fixture: ComponentFixture<QuickSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickSettingsComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSettingsComponent);
    component = fixture.componentInstance;
    component.configuration = {
      restDuration: 5,
      stepDuration: 60,
      totalIterations: 5,
      warningTimer: 10,
      volume: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
