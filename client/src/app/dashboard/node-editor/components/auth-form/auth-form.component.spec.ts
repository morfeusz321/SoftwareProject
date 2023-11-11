import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';
import {FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {AuthenticationTypeEnum} from "@app/shared/enums/authentication-type.enum";
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;

  const fb = new FormBuilder()

  beforeEach(async () => {
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.group({
        type: ['', Validators.required],
        token: [''],
      })
    });
    await TestBed.configureTestingModule({
      declarations: [ AuthFormComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoTestingModule
      ],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirective }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormComponent);
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the form controls', () => {
    const arg = (formGroupDirectiveSpy.form.controls['test'] as FormGroup)
    component.ngOnInit();
    arg.controls['type'].setValue(AuthenticationTypeEnum.NONE);
    expect(arg.controls['token'].value).toEqual('');

    arg.controls['type'].setValue(AuthenticationTypeEnum.API_KEY);
    arg.controls['token'].setValue('token');
    expect(arg.controls['token'].value).toEqual('token');

    arg.controls['type'].setValue(AuthenticationTypeEnum.NONE);
    expect(arg.controls['token'].value).toEqual('');
  });
});
