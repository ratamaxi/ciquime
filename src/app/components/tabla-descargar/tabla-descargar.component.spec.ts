import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDescargarComponent } from './tabla-descargar.component';

describe('TablaDescargarComponent', () => {
  let component: TablaDescargarComponent;
  let fixture: ComponentFixture<TablaDescargarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaDescargarComponent]
    });
    fixture = TestBed.createComponent(TablaDescargarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
