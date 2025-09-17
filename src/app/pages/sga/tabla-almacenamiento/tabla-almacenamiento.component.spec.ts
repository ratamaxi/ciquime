import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAlmacenamientoComponent } from './tabla-almacenamiento.component';

describe('TablaAlmacenamientoComponent', () => {
  let component: TablaAlmacenamientoComponent;
  let fixture: ComponentFixture<TablaAlmacenamientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaAlmacenamientoComponent]
    });
    fixture = TestBed.createComponent(TablaAlmacenamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
