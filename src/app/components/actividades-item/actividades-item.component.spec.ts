import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesItemComponent } from './actividades-item.component';

describe('ActividadesItemComponent', () => {
  let component: ActividadesItemComponent;
  let fixture: ComponentFixture<ActividadesItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadesItemComponent]
    });
    fixture = TestBed.createComponent(ActividadesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
