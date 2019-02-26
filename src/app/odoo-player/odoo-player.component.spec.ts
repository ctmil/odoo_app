import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdooPlayerComponent } from './odoo-player.component';

describe('OdooPlayerComponent', () => {
  let component: OdooPlayerComponent;
  let fixture: ComponentFixture<OdooPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdooPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdooPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
