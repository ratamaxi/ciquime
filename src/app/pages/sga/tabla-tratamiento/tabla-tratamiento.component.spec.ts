import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTratamientoComponent } from './tabla-tratamiento.component';

describe('TablaTratamientoComponent', () => {
  let component: TablaTratamientoComponent;
  let fixture: ComponentFixture<TablaTratamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaTratamientoComponent]
    });
    fixture = TestBed.createComponent(TablaTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
