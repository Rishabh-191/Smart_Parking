import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanneroutComponent } from './scannerout.component';

describe('ScanneroutComponent', () => {
  let component: ScanneroutComponent;
  let fixture: ComponentFixture<ScanneroutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScanneroutComponent]
    });
    fixture = TestBed.createComponent(ScanneroutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
