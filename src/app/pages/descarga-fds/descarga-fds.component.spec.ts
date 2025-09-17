import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaFdsComponent } from './descarga-fds.component';

describe('DescargaFdsComponent', () => {
  let component: DescargaFdsComponent;
  let fixture: ComponentFixture<DescargaFdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescargaFdsComponent]
    });
    fixture = TestBed.createComponent(DescargaFdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
