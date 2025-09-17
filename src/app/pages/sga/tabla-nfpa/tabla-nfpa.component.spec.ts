import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaNfpaComponent } from './tabla-nfpa.component';

describe('TablaNfpaComponent', () => {
  let component: TablaNfpaComponent;
  let fixture: ComponentFixture<TablaNfpaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaNfpaComponent]
    });
    fixture = TestBed.createComponent(TablaNfpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
