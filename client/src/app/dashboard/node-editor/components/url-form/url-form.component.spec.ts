import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlFormComponent } from './url-form.component';
import {FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {urlValidator} from "@app/shared/validators/form-validators";
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('URLFormComponent', () => {
  let component: UrlFormComponent;
  let fixture: ComponentFixture<UrlFormComponent>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;

  const fb = new FormBuilder()

  beforeEach(async () => {
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.group({
        url: ['', [Validators.required, urlValidator()]],
      })
    });
    await TestBed.configureTestingModule({
      declarations: [ UrlFormComponent ],
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

    fixture = TestBed.createComponent(UrlFormComponent);
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
    expect(arg.controls['url']).toBeDefined();
  });
});
