import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicalFileDetailPage } from './mechanical-file-detail.page';

describe('MechanicalFileDetailPage', () => {
  let component: MechanicalFileDetailPage;
  let fixture: ComponentFixture<MechanicalFileDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MechanicalFileDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
