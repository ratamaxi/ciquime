import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaVideosComponent } from './ayuda-videos.component';

describe('AyudaVideosComponent', () => {
  let component: AyudaVideosComponent;
  let fixture: ComponentFixture<AyudaVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AyudaVideosComponent]
    });
    fixture = TestBed.createComponent(AyudaVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
