import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { AuthenticationTypeEnum } from '@app/shared/enums/authentication-type.enum';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
/**
 * Component for editing the auth form a node
 */
@UntilDestroy()
@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input() formGroupName: string;

  authForm: FormGroup;
  methods = Object.values(AuthenticationTypeEnum);
  selectedNode: INode;

  public authFormText = 'nodeEditor.authForm.';

  /**
   *  Constructor for the auth form component
   * @param rootFormGroup - The root form group
   */
  constructor(private rootFormGroup: FormGroupDirective) {}

  /**
   * Function to initialize the component with the correct form and handle auth changes
   */
  ngOnInit(): void {
    this.authForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.authForm.controls['type'].valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value === 'NONE') {
        this.authForm.controls['token'].setValue('');
      }
    });
  }
}
