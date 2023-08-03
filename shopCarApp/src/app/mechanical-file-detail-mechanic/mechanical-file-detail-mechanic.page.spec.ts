import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MechanicalFileDetailMechanicPage } from './mechanical-file-detail-mechanic.page';

describe('MechanicalFileDetailMechanicPage', () => {
  let component: MechanicalFileDetailMechanicPage;
  let fixture: ComponentFixture<MechanicalFileDetailMechanicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MechanicalFileDetailMechanicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
