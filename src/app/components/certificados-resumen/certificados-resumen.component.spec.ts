import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadosResumenComponent } from './certificados-resumen.component';

describe('CertificadosResumenComponent', () => {
  let component: CertificadosResumenComponent;
  let fixture: ComponentFixture<CertificadosResumenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificadosResumenComponent]
    });
    fixture = TestBed.createComponent(CertificadosResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
