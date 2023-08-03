import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalAddMechanicComponent } from './modal-add-mechanic.component';

describe('ModalAddMechanicComponent', () => {
  let component: ModalAddMechanicComponent;
  let fixture: ComponentFixture<ModalAddMechanicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddMechanicComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
