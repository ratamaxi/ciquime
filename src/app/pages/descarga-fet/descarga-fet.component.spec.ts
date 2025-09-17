import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaFetComponent } from './descarga-fet.component';

describe('DescargaFetComponent', () => {
  let component: DescargaFetComponent;
  let fixture: ComponentFixture<DescargaFetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescargaFetComponent]
    });
    fixture = TestBed.createComponent(DescargaFetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
