import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailNotificationPage } from './detail-notification.page';

describe('DetailNotificationPage', () => {
  let component: DetailNotificationPage;
  let fixture: ComponentFixture<DetailNotificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailNotificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
