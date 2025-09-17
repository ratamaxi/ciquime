import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEmergenciaComponent } from './tabla-emergencia.component';

describe('TablaEmergenciaComponent', () => {
  let component: TablaEmergenciaComponent;
  let fixture: ComponentFixture<TablaEmergenciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaEmergenciaComponent]
    });
    fixture = TestBed.createComponent(TablaEmergenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
