import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPeligroComponent } from './tabla-peligro.component';

describe('TablaComponent', () => {
  let component: TablaPeligroComponent;
  let fixture: ComponentFixture<TablaPeligroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaPeligroComponent]
    });
    fixture = TestBed.createComponent(TablaPeligroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
