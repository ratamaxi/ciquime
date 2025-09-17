import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaEtiquetaComponent } from './descarga-etiqueta.component';

describe('DescargaEtiquetaComponent', () => {
  let component: DescargaEtiquetaComponent;
  let fixture: ComponentFixture<DescargaEtiquetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescargaEtiquetaComponent]
    });
    fixture = TestBed.createComponent(DescargaEtiquetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
