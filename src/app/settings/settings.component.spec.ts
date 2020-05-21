import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { StoreService } from '../store.service';

xdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [StoreService, Router],
      imports: [ReactiveFormsModule, RouterModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
