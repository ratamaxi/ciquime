import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarInsumoComponent } from './buscar-insumo.component';

describe('BuscarInsumoComponent', () => {
  let component: BuscarInsumoComponent;
  let fixture: ComponentFixture<BuscarInsumoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarInsumoComponent]
    });
    fixture = TestBed.createComponent(BuscarInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
