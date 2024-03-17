import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Parking1Component } from './parking1.component';

describe('Parking1Component', () => {
  let component: Parking1Component;
  let fixture: ComponentFixture<Parking1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Parking1Component]
    });
    fixture = TestBed.createComponent(Parking1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
