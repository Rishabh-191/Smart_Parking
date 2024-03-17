import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlgateComponent } from './controlgate.component';

describe('ControlgateComponent', () => {
  let component: ControlgateComponent;
  let fixture: ComponentFixture<ControlgateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlgateComponent]
    });
    fixture = TestBed.createComponent(ControlgateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
