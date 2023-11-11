import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CreateNewCustomNodeDialogComponent } from './create-new-custom-node-dialog.component';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { IActionNode } from '@app/shared/interfaces/node/node.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreateNewCustomNodeDialogComponent', () => {
  let component: CreateNewCustomNodeDialogComponent;
  let fixture: ComponentFixture<CreateNewCustomNodeDialogComponent>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<CreateNewCustomNodeDialogComponent>>;
  let mockFormData: any = { action: { request: { url: '', body: '', auth: { token: '' } } } as IActionNode };

  beforeEach(() => {
    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        TranslocoTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ], // Import any necessary modules
      declarations: [CreateNewCustomNodeDialogComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockFormData },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewCustomNodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.nodeEditForm.controls['urlForm']).toBeInstanceOf(UntypedFormGroup);
    expect(component.nodeEditForm.controls['authForm']).toBeInstanceOf(UntypedFormGroup);
    expect(component.nodeEditForm.controls['bodyForm']).toBeInstanceOf(UntypedFormGroup);
    expect(component.nodeEditForm.controls['name']).toBeTruthy();
    expect(component.nodeEditForm.controls['method']).toBeTruthy();
    expect(component.urlForm.controls['url']).toBeTruthy();
    expect(component.authForm.controls['token'].value).toEqual('');
    expect(component.bodyForm.controls['body']).toBeTruthy();
  });

  it('should close the dialog when onNoClick is called', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should update the data and close the dialog when onSaveClick is called', () => {
    component.nodeEditForm.controls['name'].setValue('test');
    component.nodeEditForm.controls['method'].setValue('GET');
    const expectedData = {
      action: {
        ...mockFormData.action,
        type: 'GET',
        name: 'test',
        request: { ...mockFormData.action.request, method: 'GET', auth: { type: '', token: '' } },
      },
    };
    component.onSaveClick();
    expect(component.data).toEqual(expectedData);
  });
});
