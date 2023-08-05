import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellsHistoryPage } from './sells-history.page';

describe('SellsHistoryPage', () => {
  let component: SellsHistoryPage;
  let fixture: ComponentFixture<SellsHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SellsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
