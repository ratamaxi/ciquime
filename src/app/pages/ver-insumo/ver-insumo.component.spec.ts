import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInsumoComponent } from './ver-insumo.component';

describe('VerInsumoComponent', () => {
  let component: VerInsumoComponent;
  let fixture: ComponentFixture<VerInsumoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerInsumoComponent]
    });
    fixture = TestBed.createComponent(VerInsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
