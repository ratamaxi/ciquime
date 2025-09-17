import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHomeComponent } from './tabla-home.component';

describe('TablaHomeComponent', () => {
  let component: TablaHomeComponent;
  let fixture: ComponentFixture<TablaHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaHomeComponent]
    });
    fixture = TestBed.createComponent(TablaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
