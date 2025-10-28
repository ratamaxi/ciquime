import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosCalidadComponent } from './certificados-calidad.component';

describe('CertificadosCalidadComponent', () => {
  let component: CertificadosCalidadComponent;
  let fixture: ComponentFixture<CertificadosCalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadosCalidadComponent]
    });
    fixture = TestBed.createComponent(CertificadosCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
