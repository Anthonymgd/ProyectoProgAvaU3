import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CedulaValidatorDirective } from './services/validadorCedula';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('CedulaValidatorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CedulaValidatorDirective, TestComponent ],
      imports: [ FormsModule, ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return null for a valid cedula', () => {
    const control = component.form.controls['cedula'];
    control.setValue('2350751315');
    const validator = new CedulaValidatorDirective();
    expect(validator.validate(control)).toEqual(null);
  });

  it('should return cedulaInvalida for an invalid cedula', () => {
    const control = component.form.controls['cedula'];
    control.setValue('1111111111');
    const validator = new CedulaValidatorDirective();
    expect(validator.validate(control)).toEqual({ 'cedulaInvalida': true });
  });
  
  @Component({
    template: `
      <form [formGroup]="form">
        <input type="text" formControlName="cedula" cedulaValidator>
      </form>
    `
  })
  class TestComponent {
    form = new FormGroup({
      'cedula': new FormControl('')
    });
  }
});