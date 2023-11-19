/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThongbaoComponent } from './thongbao.component';

describe('ThongbaoComponent', () => {
  let component: ThongbaoComponent;
  let fixture: ComponentFixture<ThongbaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThongbaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongbaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
