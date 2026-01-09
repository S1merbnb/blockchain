import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainLogComponent } from './blockchain-log.component';

describe('BlockchainLogComponent', () => {
  let component: BlockchainLogComponent;
  let fixture: ComponentFixture<BlockchainLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockchainLogComponent]
    });
    fixture = TestBed.createComponent(BlockchainLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
