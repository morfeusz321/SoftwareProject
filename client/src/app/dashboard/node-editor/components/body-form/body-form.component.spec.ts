import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyFormComponent } from './body-form.component';
import {FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {jsonValidator} from "@app/shared/validators/form-validators";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('BodyFormComponent', () => {
  let component: BodyFormComponent;
  let fixture: ComponentFixture<BodyFormComponent>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;

  const fb = new FormBuilder()

  beforeEach(async () => {
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.group({
        body: ['', jsonValidator()],
      })
    });
    await TestBed.configureTestingModule({
      declarations: [ BodyFormComponent ],
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

    fixture = TestBed.createComponent(BodyFormComponent);
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the form', () => {
    const arg = (formGroupDirectiveSpy.form.controls['test'] as FormGroup)
    expect(arg.controls['body']).toBeDefined();
  });
});
