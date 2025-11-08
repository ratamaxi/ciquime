import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCertificadoCalidadComponent } from './editar-certificado-calidad.component';

describe('EditarCertificadoCalidadComponent', () => {
  let component: EditarCertificadoCalidadComponent;
  let fixture: ComponentFixture<EditarCertificadoCalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCertificadoCalidadComponent]
    });
    fixture = TestBed.createComponent(EditarCertificadoCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
