import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

/**
 * Component for the url form
 */
@Component({
  selector: 'app-url-form',
  templateUrl: './url-form.component.html',
  styleUrls: ['./url-form.component.scss'],
})
export class UrlFormComponent implements OnInit {
  urlForm: FormGroup;
  @Input() formGroupName: string;

  public urlFormText = 'nodeEditor.urlForm.';

  /**
   * Constructor for the url form component
   * @param rootFormGroup - root form group
   */
  constructor(private rootFormGroup: FormGroupDirective) {}

  /**
   * Lifecycle function to initialize the component with the correct form
   */
  ngOnInit(): void {
    this.urlForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
