import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

/**
 * Component for editing the body form a node
 */
@Component({
  selector: 'app-body-form',
  templateUrl: './body-form.component.html',
  styleUrls: ['./body-form.component.scss'],
})
export class BodyFormComponent implements OnInit {
  bodyForm: FormGroup;
  @Input() formGroupName: string;

  public bodyFormText = 'nodeEditor.bodyForm.';

  /**
   * Constructor for the body form component
   * @param rootFormGroup - The root form group
   */
  constructor(private rootFormGroup: FormGroupDirective) {}

  /**
   * Function to initialize the component with the correct form
   */
  ngOnInit(): void {
    this.bodyForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
