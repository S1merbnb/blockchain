import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFarmComponent } from './create-farm.component';

describe('CreateFarmComponent', () => {
  let component: CreateFarmComponent;
  let fixture: ComponentFixture<CreateFarmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFarmComponent]
    });
    fixture = TestBed.createComponent(CreateFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
