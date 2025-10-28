import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgaSeleccionadoComponent } from './sga-seleccionado.component';

describe('SgaSeleccionadoComponent', () => {
  let component: SgaSeleccionadoComponent;
  let fixture: ComponentFixture<SgaSeleccionadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SgaSeleccionadoComponent]
    });
    fixture = TestBed.createComponent(SgaSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
