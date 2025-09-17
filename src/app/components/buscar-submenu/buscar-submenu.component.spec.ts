import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarSubmenuComponent } from './buscar-submenu.component';

describe('BuscarSubmenuComponent', () => {
  let component: BuscarSubmenuComponent;
  let fixture: ComponentFixture<BuscarSubmenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarSubmenuComponent]
    });
    fixture = TestBed.createComponent(BuscarSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
