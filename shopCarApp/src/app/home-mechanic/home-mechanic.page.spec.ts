import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMechanicPage } from './home-mechanic.page';

describe('HomeMechanicPage', () => {
  let component: HomeMechanicPage;
  let fixture: ComponentFixture<HomeMechanicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeMechanicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
