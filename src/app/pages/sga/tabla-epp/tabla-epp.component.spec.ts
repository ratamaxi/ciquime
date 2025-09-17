import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEppComponent } from './tabla-epp.component';

describe('TablaEppComponent', () => {
  let component: TablaEppComponent;
  let fixture: ComponentFixture<TablaEppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaEppComponent]
    });
    fixture = TestBed.createComponent(TablaEppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
