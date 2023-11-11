import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import {
  IActionNode,
  IConditionNode,
  IInsocialNode,
  IMapNode,
  INode,
  ITriggerNode,
} from '@app/shared/interfaces/node/node.interface';
import { IArgument } from '@app/shared/interfaces/argument/argument.interface';
import { IAuthentication } from '@app/shared/interfaces/auth/authentication.interface';
import { IExpression } from '@app/shared/interfaces/condition/condition.interface';
import {
  jsonOrXmlValidator,
  nodeIdValidator,
  numberValidator,
  urlValidator,
} from '@app/shared/validators/form-validators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { environment } from '@env/environment';
import { IntervalsEnum } from '@app/shared/enums/intervals.enum';
import { TranslocoService } from '@ngneat/transloco';
import { InviteConfiguration } from '@app/shared/interfaces/invites/invite.interface';
import { DateTypeEnum } from '@app/shared/enums/date-type.enum';
import { ExecutionTimeEnum } from '@app/shared/enums/execution-time.enum';
import { ComparisonOptionsEnum } from '@app/shared/enums/comparison-options.enum';
import { getCronFromSchedule, getScheduleFromCron } from '@app/shared/utils/cron/cron.util';

/**
 * Parent component for the node edit menu containing the form for editing nodes
 */
@UntilDestroy()
@Component({
  selector: 'app-form-drop-list',
  templateUrl: './form-drop-list.component.html',
  styleUrls: ['./form-drop-list.component.scss'],
})
export class FormDropListComponent implements OnInit {
  protected readonly MethodsEnum = MethodsEnum;
  urlVisible: boolean;
  authVisible: boolean;
  argumentsVisible: boolean;
  conditionalVisible: boolean;
  isTrigger: boolean;
  isMap: boolean;
  selectedNode: INode;
  bodyVisible: boolean;
  inviteVisible: boolean;
  index: number;

  public headers = 'nodeEditor.headers.';
  nodeEditForm = this.fb.group({});
  urlForm = this.fb.group({
    url: ['', [Validators.required, urlValidator()]],
  });

  nodeName = this.fb.group({
    name: ['', [Validators.required]],
  });

  authForm = this.fb.group({
    type: ['', Validators.required],
    token: [''],
  });

  argForm = this.fb.group({
    arguments: this.fb.array([]),
  });

  emailForm = this.fb.group({
    field: ['', Validators.required],
    parentId: ['', [Validators.required, nodeIdValidator(this.graphEditorFacade)]],
  });

  readonly dateTypeEnum = DateTypeEnum;
  readonly executionTime = ExecutionTimeEnum;

  conditionForm = this.createConditionForm();

  createConditionForm() {
    return this.fb.group({
      firstFieldValue: ['', Validators.required],
      firstFieldNodeId: ['', [Validators.required, nodeIdValidator(this.graphEditorFacade)]],
      comparisonType: ['', Validators.required],
      compareTo: ['', Validators.required],
      secondFieldUserValue: ['', Validators.required],
      secondFieldNodeValue: ['', Validators.required],
      secondFieldNodeId: ['', Validators.required],
      secondFieldTimeDays: [0, [Validators.required, numberValidator()]],
      secondFieldTimeMonths: [0, [Validators.required, numberValidator()]],
      secondFieldTimeYears: [0, [Validators.required, numberValidator()]],
      secondFieldTimeExecutionTime: ['', Validators.required],
      secondFieldTimeDateType: ['', Validators.required],
      secondFieldTimeDate: ['', Validators.required],
    });
  }

  bodyForm = this.fb.group({
    body: ['', jsonOrXmlValidator()],
  });

  triggerForm = this.fb.group({
    interval: ['', Validators.required],
    time: ['', Validators.required],
  });

  inviteFrom = this.fb.group({
    surveyId: ['', Validators.required],
    template: ['', Validators.required],
    subject: ['', Validators.required],
    fromName: ['', Validators.required],
    fromEmail: ['', Validators.required],
  });

  mapForm = this.fb.group({
    fieldName: ['', Validators.required],
    parentNodeId: ['', [Validators.required, nodeIdValidator(this.graphEditorFacade)]],
    mappedFieldName: ['', Validators.required],
  });

  /**
   * Constructor for the form drop list component
   * @param graphEditorFacade - facade for the graph editor
   * @param fb - form builder
   * @param messages - toastr service
   * @param transloco - translation service
   */
  constructor(
    private graphEditorFacade: GraphEditorFacade,
    private fb: UntypedFormBuilder,
    private messages: ToastrService,
    public transloco: TranslocoService
  ) {}

  /**
   * Function to initialize subscriptions to the selected node to change forms accordingly
   */
  ngOnInit() {
    this.graphEditorFacade.selectedNode$.pipe(untilDestroyed(this)).subscribe((node) => {
      this.nodeEditForm = this.fb.group({});
      (this.argForm.get('arguments') as FormArray).clear();
      if (!!node) {
        this.bodyVisible = node.type in MethodsEnum;
        this.urlVisible = node.type in MethodsEnum;
        this.authVisible = node.type in MethodsEnum || node.type in InsocialMethodsEnum;
        this.inviteVisible = node.type in InsocialMethodsEnum;
        this.argumentsVisible = this.authVisible;
        this.isTrigger = node.type === ConditionalTypeEnum.TRIGGER;
        this.isMap = node.type === ConditionalTypeEnum.MAP;
        this.conditionalVisible = node.type in ConditionalTypeEnum && !this.isTrigger && !this.isMap;
        this.selectedNode = node;
        this.loadEditMenuValues(node);
      }
    });
  }

  /**
   * Updates node editing form with the values of a selected node
   * @param node - selected node
   */
  loadEditMenuValues(node: INode): void {
    if (this.urlVisible) {
      this.nodeEditForm.addControl('urlForm', this.urlForm);
      this.urlForm.patchValue((node as IActionNode).request);
    }
    if (this.authVisible) {
      this.nodeEditForm.addControl('authForm', this.authForm);
      this.authForm.patchValue((node as IActionNode).request.auth);
    }
    if (this.argumentsVisible) {
      this.nodeEditForm.addControl('argForm', this.argForm);
      for (let arg of (node as IActionNode).arguments) {
        const argForm = this.fb.group({
          alias: new FormControl('', Validators.required),
          parentId: new FormControl('', [Validators.required, nodeIdValidator(this.graphEditorFacade)]),
          field: new FormControl('', Validators.required),
        });
        argForm.patchValue(arg);
        (this.argForm.get('arguments') as FormArray).push(argForm);
      }
    }
    if (this.conditionalVisible) {
      this.conditionForm.reset(this.createConditionForm());
      this.nodeEditForm.addControl('conditionForm', this.conditionForm);
      const conditionNode = (node as IConditionNode).expression;
      this.conditionForm.patchValue(conditionNode as IExpression);
      if (
        conditionNode.compareTo === ComparisonOptionsEnum.TIME_VALUE &&
        conditionNode.secondFieldTimeDate === this.dateTypeEnum.EXECUTION_DATE
      ) {
        this.conditionForm.get('secondFieldTimeDateType').setValue(this.dateTypeEnum.EXECUTION_DATE);
      } else if (conditionNode.compareTo === ComparisonOptionsEnum.TIME_VALUE) {
        this.conditionForm.get('secondFieldTimeDateType').setValue(this.dateTypeEnum.CUSTOM_DATE);
      }
    }
    if (this.isTrigger) {
      this.nodeEditForm.addControl('triggerForm', this.triggerForm);
      const schedule = getScheduleFromCron((node as ITriggerNode).schedule);
      if (schedule.interval === IntervalsEnum.WEEKLY) {
        this.triggerForm.removeControl('monthRepeat');
        this.triggerForm.addControl('repeatOn', new FormControl(schedule.repeatOn, Validators.required), {
          emitEvent: false,
        });
      } else if (schedule.interval === IntervalsEnum.MONTHLY) {
        this.triggerForm.removeControl('repeatOn');
        this.triggerForm.addControl('monthRepeat', new FormControl(schedule.monthRepeat, Validators.required), {
          emitEvent: false,
        });
      }
      this.triggerForm.controls['time'].setValue(schedule.time);
      this.triggerForm.controls['interval'].setValue(schedule.interval);
    }
    if (this.bodyVisible) {
      this.nodeEditForm.addControl('bodyForm', this.bodyForm);
      this.bodyForm.patchValue({ body: (node as IActionNode).request.body });
    }
    if (this.inviteVisible) {
      this.nodeEditForm.addControl('inviteForm', this.inviteFrom);
      this.nodeEditForm.addControl('emailForm', this.emailForm);
      this.emailForm.patchValue((node as IInsocialNode).email);
      if ((node as IInsocialNode).request.body) {
        this.inviteFrom.patchValue(this.fillInviteConfigFromBody(node as IInsocialNode));
      }
    }
    if (this.isMap) {
      this.nodeEditForm.addControl('mapForm', this.mapForm);
      this.nodeEditForm.get('mapForm').patchValue((node as IMapNode).mapExpression);
    }
    this.nodeEditForm.addControl('nodeName', this.nodeName);
    this.nodeEditForm.get('nodeName').patchValue(node);
  }

  /**
   * Updates the email config from post body
   * @param node - insocial node
   * @returns invite configuration
   */
  fillInviteConfigFromBody(node: IInsocialNode): InviteConfiguration {
    const withoutArgs = node.request.body.replace('<<email_data>>', '[]');
    const surveyId = node.request.url.match(/\..*\/(.*)\/email-invites/)[1];
    return { ...JSON.parse(withoutArgs), surveyId } as InviteConfiguration;
  }

  /**
   * Saves the values of the node editing form to the selected node
   */
  saveNode(): void {
    if (this.selectedNode.type in MethodsEnum) {
      this.updateActionNode();
    } else if (this.selectedNode.type in ConditionalTypeEnum && !this.isTrigger && !this.isMap) {
      this.updateConditionalNode();
    } else if (this.selectedNode.type in InsocialMethodsEnum) {
      this.updateInsocialNode();
    } else if (this.isTrigger) {
      this.updateTriggerNode();
    } else if (this.isMap) {
      this.updateMapNode();
    }
    this.graphEditorFacade.deselectNode();
    this.messages.success('Node updated successfully', 'Success');
  }

  /**
   * Updates the trigger node with new values
   */
  updateTriggerNode(): void {
    const schedule = getCronFromSchedule(this.triggerForm.value);
    this.graphEditorFacade.updateNode({
      ...this.selectedNode,
      schedule,
      name: this.nodeName.get('name').value,
    } as ITriggerNode);
  }

  /**
   * Updates the map node with new values
   */
  updateMapNode(): void {
    this.graphEditorFacade.updateNode({
      ...this.selectedNode,
      mapExpression: this.mapForm.value,
      name: this.nodeName.get('name').value,
    } as IMapNode);
  }

  /**
   * Updates the action node with new values
   */
  updateActionNode(): void {
    this.graphEditorFacade.updateNode(this.getActionNode());
  }

  /**
   * Updates the conditional node with new values
   */
  updateConditionalNode(): void {
    const condition = this.getCondition();
    if (condition.compareTo === ComparisonOptionsEnum.USER_VALUE) {
      condition.secondFieldNodeId = '';
      condition.secondFieldNodeValue = '';
    } else {
      condition.secondFieldUserValue = '';
    }
    this.graphEditorFacade.updateNode({
      ...this.selectedNode,
      expression: condition,
      name: this.nodeName.get('name').value,
    } as IConditionNode);
  }

  /**
   * Updates the insocial node with new values
   */
  updateInsocialNode(): void {
    const inviteUrl = `${environment.insocialApiUrl}/customers/${environment.customerId}/surveys/${this.inviteFrom.value['surveyId']}/email-invites`;
    const request = {
      method: MethodsEnum.POST,
      body: this.getBodyFromInviteConfig(),
      url: inviteUrl,
      auth: this.getAuth(),
    } as IRequest;

    const args = this.getArguments();
    const email = { alias: 'email', ...this.emailForm.value } as IArgument;
    const node = {
      ...this.selectedNode,
      request,
      arguments: args,
      inviteConfiguration: this.inviteFrom.value,
      email,
      name: this.nodeName.get('name').value,
    } as IInsocialNode;
    this.graphEditorFacade.updateNode(node);
  }

  /**
   * @returns the url from the urlForm
   */
  getUrl(): string {
    return this.urlForm.value.url;
  }

  /**
   * @returns the IAuthentication from the authForm
   */
  getAuth(): IAuthentication {
    return this.authForm.value as IAuthentication;
  }

  /**
   * @returns the IArgument[] from the argForm
   */
  getArguments(): IArgument[] {
    return this.argForm.value.arguments as IArgument[];
  }

  /**
   * @returns the ICondition from the conditionForm
   */
  getCondition(): IExpression {
    return this.conditionForm.value as IExpression;
  }

  /**
   * @returns the body from the bodyForm
   */
  getBody(): string {
    return this.bodyForm.value.body;
  }

  /**
   * @returns the body from the inviteForm
   */
  getBodyFromInviteConfig(): string {
    let body = this.inviteFrom.value;
    delete body['surveyId'];
    body.invites = '<<email_data>>';
    let bodyString = JSON.stringify(body);
    return bodyString.replace(/"<<email_data>>"/g, '<<email_data>>');
  }

  /**
   * Deletes the selected node
   */
  deleteNode(): void {
    if (this.selectedNode != null) {
      this.graphEditorFacade.removeNode(this.selectedNode.id);
      this.graphEditorFacade.deselectNode();
      this.messages.success('Node deleted successfully', 'Success');
    } else {
      throw new Error('No node selected');
    }
  }

  /**
   * @returns the IActionNode from the nodeEditForm
   */
  getActionNode(): IActionNode {
    const request = {
      method: this.selectedNode!.type,
      body: this.getBody(),
      url: this.getUrl(),
      auth: this.getAuth(),
    } as IRequest;
    const args = this.getArguments();
    return { ...this.selectedNode, request, arguments: args, name: this.nodeName.get('name').value } as IActionNode;
  }

  /**
   * @returns true if the nodeEditForm is dirty
   */
  isDirty(): boolean {
    return this.nodeEditForm.dirty;
  }
}
