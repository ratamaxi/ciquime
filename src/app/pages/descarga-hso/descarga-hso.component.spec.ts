import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaHsoComponent } from './descarga-hso.component';

describe('DescargaHsoComponent', () => {
  let component: DescargaHsoComponent;
  let fixture: ComponentFixture<DescargaHsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescargaHsoComponent]
    });
    fixture = TestBed.createComponent(DescargaHsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
