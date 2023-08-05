import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyvehiclesPage } from './myvehicles.page';

describe('MyvehiclesPage', () => {
  let component: MyvehiclesPage;
  let fixture: ComponentFixture<MyvehiclesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyvehiclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
