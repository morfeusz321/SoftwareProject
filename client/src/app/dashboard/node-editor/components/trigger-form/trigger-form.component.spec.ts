import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerFormComponent } from './trigger-form.component';
import {FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {IntervalsEnum} from "@app/shared/enums/intervals.enum";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('TriggerFormComponent', () => {
  let component: TriggerFormComponent;
  let fixture: ComponentFixture<TriggerFormComponent>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;

  const fb = new FormBuilder()

  beforeEach(async () => {
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
      test: fb.group({
        interval: ['', Validators.required],
        time: ['', Validators.required],
      })
    });

    await TestBed.configureTestingModule({
      declarations: [TriggerFormComponent],
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
        {provide: FormGroupDirective, useValue: formGroupDirective}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggerFormComponent);
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  });

  it('should change the form controls', () => {
    const arg = (formGroupDirectiveSpy.form.controls['test'] as FormGroup)
    component.ngOnInit();

    expect(arg.controls['repeatOn']).toBeUndefined();
    expect(arg.controls['monthRepeat']).toBeUndefined();
    expect(arg.controls['interval']).toBeDefined();
    expect(arg.controls['time']).toBeDefined();

    arg.controls['interval'].setValue(IntervalsEnum.WEEKLY);

    expect(arg.controls['repeatOn'].value).toEqual([]);
    expect(arg.controls['monthRepeat']).toBeUndefined();

    arg.controls['interval'].setValue(IntervalsEnum.QUARTERLY);

    expect(arg.controls['repeatOn']).toBeUndefined();
    expect(arg.controls['monthRepeat']).toBeUndefined();

    arg.controls['interval'].setValue(IntervalsEnum.MONTHLY);

    expect(arg.controls['repeatOn']).toBeUndefined();
    expect(arg.controls['monthRepeat'].value).toEqual('');

    arg.controls['interval'].setValue(IntervalsEnum.HALF_YEARLY);

    expect(arg.controls['repeatOn']).toBeUndefined();
    expect(arg.controls['monthRepeat']).toBeUndefined();

    arg.controls['interval'].setValue(IntervalsEnum.YEARLY);

    expect(arg.controls['repeatOn']).toBeUndefined();
    expect(arg.controls['monthRepeat']).toBeUndefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
