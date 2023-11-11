import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { jsonValidator, urlValidator } from '@app/shared/validators/form-validators';
import { ICustomNode } from '@app/shared/interfaces/node/node.interface';
import { MethodsEnum } from '@app/shared/enums/methods.enum';

/**
 * Component for the create new custom node dialog
 */
@Component({
  selector: 'app-create-new-custom-node-dialog',
  templateUrl: './create-new-custom-node-dialog.component.html',
  styleUrls: ['./create-new-custom-node-dialog.component.scss'],
})
export class CreateNewCustomNodeDialogComponent implements OnInit {
  readonly methods = Object.values(MethodsEnum);

  urlForm = this.fb.group({
    url: ['', [Validators.required, urlValidator()]],
  });

  authForm = this.fb.group({
    type: ['', Validators.required],
    token: [''],
  });

  bodyForm = this.fb.group({
    body: ['', jsonValidator()],
  });

  nodeEditForm = this.fb.group({
    name: ['', Validators.required],
    method: ['', Validators.required],
  });

  /**
   * Constructor for the create new custom node dialog component
   * @param dialogRef - dialog ref
   * @param fb - form builder
   * @param data - data
   */
  constructor(
    public dialogRef: MatDialogRef<CreateNewCustomNodeDialogComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ICustomNode
  ) {}

  /**
   * On init lifecycle hook to initialize the forms
   */
  ngOnInit(): void {
    this.nodeEditForm.addControl('urlForm', this.urlForm);
    this.nodeEditForm.addControl('bodyForm', this.bodyForm);
    this.nodeEditForm.addControl('authForm', this.authForm);
    this.urlForm.patchValue({ url: this.data.action.request.url });
    this.bodyForm.patchValue({ body: this.data.action.request.body });
    this.authForm.patchValue(this.data.action.request.auth);
    this.nodeEditForm.patchValue({ name: this.data.action.name, method: this.data.action.type });
  }

  /**
   * Function to close the dialog without saving
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Function to save the changes
   */
  onSaveClick(): void {
    const method = this.nodeEditForm.value['method'];
    const auth = this.authForm.value;
    this.data.action = {
      ...this.data.action,
      type: method,
      name: this.nodeEditForm.value['name'],
      request: { ...this.data.action.request, ...this.urlForm.value, ...this.bodyForm.value, auth, method },
    };
  }
}
