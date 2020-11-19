import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeparksComponent } from './themeparks.component';

describe('ThemeparksComponent', () => {
  let component: ThemeparksComponent;
  let fixture: ComponentFixture<ThemeparksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeparksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeparksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
