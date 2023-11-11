import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormDropListComponent } from './form-drop-list.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { of } from 'rxjs';
import * as presets from './../../../../shared/testing_presets/testing_presets';
import { ToastrService } from 'ngx-toastr';
import { GraphEditorEffects } from '@app/dashboard/core/state/graph-editor-store/graph-editor.effects';
import { HttpClientModule } from '@angular/common/http';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthenticationTypeEnum } from '@app/shared/enums/authentication-type.enum';
import { IAuthentication } from '@app/shared/interfaces/auth/authentication.interface';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import { IArgument } from '@app/shared/interfaces/argument/argument.interface';
import { ConditionTypeEnum } from '@app/shared/enums/condition-type.enum';
import { ComparisonOptionsEnum } from '@app/shared/enums/comparison-options.enum';
import { IExpression } from '@app/shared/interfaces/condition/condition.interface';
import { DayEnum, IntervalsEnum } from '@app/shared/enums/intervals.enum';
import { IActionNode, IConditionNode, ITriggerNode } from '@app/shared/interfaces/node/node.interface';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { DateTypeEnum } from '@app/shared/enums/date-type.enum';
import { ExecutionTimeEnum } from '@app/shared/enums/execution-time.enum';

describe('FormDropListComponent', () => {
  let component: FormDropListComponent;
  let fixture: ComponentFixture<FormDropListComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let untypedFormBuilderSpy: jasmine.SpyObj<UntypedFormBuilder>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['deleteNode', 'deselectNode', 'updateNode'], {
      selectedNode$: of(null),
    });
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const untypedFormBuilder = new UntypedFormBuilder();
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoTestingModule,
      ],
      declarations: [FormDropListComponent],
      providers: [
        GraphEditorEffects,
        HttpClientModule,
        { provide: GraphEditorFacade, useValue: facadeSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: UntypedFormBuilder, useValue: untypedFormBuilder },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create', () => {
    injectDependencies();

    expect(component).toBeTruthy();
  });

  it('should initialize the nodeEditForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {};
    const nodeEditForm = component.nodeEditForm as FormGroup;

    expect(nodeEditForm.value).toEqual(expectedFormValue);
  });

  it('should initialize the urlForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      url: '',
    };
    const urlForm = component.urlForm as FormGroup;

    expect(urlForm.value).toEqual(expectedFormValue);
  });

  it('should initialize the authForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      type: '',
      token: '',
    };
    const authForm = component.authForm as FormGroup;

    expect(authForm.value).toEqual(expectedFormValue);
    expect(authForm.controls['type'].validator).toEqual(Validators.required);
  });

  it('should initialize the argForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      arguments: [],
    };
    const argForm = component.argForm as FormGroup;

    expect(argForm.value).toEqual(expectedFormValue);
  });

  it('should initialize the emailForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      field: '',
      parentId: '',
    };
    const emailForm = component.emailForm as FormGroup;

    expect(emailForm.value).toEqual(expectedFormValue);
    expect(emailForm.controls['field'].validator).toEqual(Validators.required);
  });

  it('should initialize the conditionForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      firstFieldValue: '',
      firstFieldNodeId: '',
      comparisonType: '',
      compareTo: '',
      secondFieldUserValue: '',
      secondFieldNodeValue: '',
      secondFieldNodeId: '',
      secondFieldTimeDays: 0,
      secondFieldTimeMonths: 0,
      secondFieldTimeYears: 0,
      secondFieldTimeExecutionTime: '',
      secondFieldTimeDateType: '',
      secondFieldTimeDate: '',
    };
    const conditionForm = component.conditionForm as FormGroup;

    expect(conditionForm.value).toEqual(expectedFormValue);
    expect(conditionForm.controls['firstFieldValue'].validator).toEqual(Validators.required);
    expect(conditionForm.controls['comparisonType'].validator).toEqual(Validators.required);
    expect(conditionForm.controls['compareTo'].validator).toEqual(Validators.required);
    expect(conditionForm.controls['secondFieldUserValue'].validator).toEqual(Validators.required);
    expect(conditionForm.controls['secondFieldNodeValue'].validator).toEqual(Validators.required);
    expect(conditionForm.controls['secondFieldNodeId'].validator).toEqual(Validators.required);
  });

  it('should initialize the bodyForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      body: '',
    };
    const bodyForm = component.bodyForm as FormGroup;

    expect(bodyForm.value).toEqual(expectedFormValue);
  });

  it('should initialize the triggerForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      interval: '',
      time: '',
    };
    const triggerForm = component.triggerForm as FormGroup;

    expect(triggerForm.value).toEqual(expectedFormValue);
    expect(triggerForm.controls['interval'].validator).toEqual(Validators.required);
    expect(triggerForm.controls['time'].validator).toEqual(Validators.required);
  });

  it('should initialize the inviteFrom correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      surveyId: '',
      template: '',
      subject: '',
      fromName: '',
      fromEmail: '',
    };
    const inviteFrom = component.inviteFrom as FormGroup;

    expect(inviteFrom.value).toEqual(expectedFormValue);
    expect(inviteFrom.controls['surveyId'].validator).toEqual(Validators.required);
    expect(inviteFrom.controls['template'].validator).toEqual(Validators.required);
    expect(inviteFrom.controls['subject'].validator).toEqual(Validators.required);
    expect(inviteFrom.controls['fromName'].validator).toEqual(Validators.required);
    expect(inviteFrom.controls['fromEmail'].validator).toEqual(Validators.required);
  });

  it('should initialize the mapForm correctly', () => {
    injectDependencies();
    const expectedFormValue = {
      fieldName: '',
      parentNodeId: '',
      mappedFieldName: '',
    };
    const mapForm = component.mapForm as FormGroup;

    expect(mapForm.value).toEqual(expectedFormValue);
    expect(mapForm.controls['fieldName'].validator).toEqual(Validators.required);
    expect(mapForm.controls['mappedFieldName'].validator).toEqual(Validators.required);
  });

  it('should recreate the node edit form and clear arguments', () => {
    injectDependencies();

    component.nodeEditForm.addControl('someControl', new FormControl(''));
    (component.argForm.controls['arguments'] as FormArray).push(new FormControl(''));
    component.ngOnInit();
    expect(component.nodeEditForm.controls['someControl']).toBeUndefined();
    expect((component.argForm.controls['arguments'] as FormArray).controls.length).toEqual(0);
  });

  it('should load an action node, edit it and save', () => {
    const actionNode = {
      ...presets.node2,
      request: {
        method: presets.node2.type,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D',
        body: '{data: yes}',
        auth: {
          type: AuthenticationTypeEnum.BEARER,
          token: 'ultra encrypted token',
        } as IAuthentication,
      } as IRequest,
      arguments: [
        {
          alias: 'the mask of zoro',
          parentId: 'unknown',
          field: 'Spain',
        } as IArgument,
      ],
    };
    const facadeSpyAction = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(actionNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facadeSpyAction });
    injectDependencies();

    component.ngOnInit();
    expect(component.bodyVisible).toBeTrue();
    expect(component.urlVisible).toBeTrue();
    expect(component.authVisible).toBeTrue();
    expect(component.argumentsVisible).toBeTrue();
    expect(component.inviteVisible).toBeFalse();
    expect(component.isTrigger).toBeFalse();
    expect(component.conditionalVisible).toBeFalse();
    expect(component.selectedNode).toEqual(actionNode);
    expect(component.nodeEditForm.value.urlForm.url).toEqual(actionNode.request.url);
    expect(component.nodeEditForm.value.authForm.type).toEqual(actionNode.request.auth.type);
    expect(component.nodeEditForm.value.authForm.token).toEqual(actionNode.request.auth.token);
    expect(component.nodeEditForm.value.argForm.arguments[0].alias).toEqual(actionNode.arguments[0].alias);
    expect(component.nodeEditForm.value.argForm.arguments[0].parentId).toEqual(actionNode.arguments[0].parentId);
    expect(component.nodeEditForm.value.argForm.arguments[0].field).toEqual(actionNode.arguments[0].field);
    expect(component.nodeEditForm.value.bodyForm.body).toEqual(actionNode.request.body);

    component.urlForm.controls['url'].setValue('https://www.youtube.com/watch?v=SChnJDfmrSU&ab_channel=WheatleyGLaDOS');
    component.authForm.controls['token'].setValue('check 5:19:00');
    component.saveNode();

    const expectedParam: IActionNode = {
      ...actionNode,
      request: {
        method: actionNode.type,
        body: component.nodeEditForm.value.bodyForm.body,
        url: 'https://www.youtube.com/watch?v=SChnJDfmrSU&ab_channel=WheatleyGLaDOS',
        auth: {
          type: actionNode.request.auth.type,
          token: 'check 5:19:00',
        } as IAuthentication,
      } as IRequest,
      arguments: component.nodeEditForm.value.argForm.arguments as IArgument[],
    };
    expect(graphEditorFacadeSpy.updateNode).toHaveBeenCalledWith(expectedParam);
  });

  it('should load a condition node with node type, edit it and save it', () => {
    const conditionalNode = {
      ...presets.node1,
      expression: {
        firstFieldValue: '',
        firstFieldNodeId: 'firstFieldNodeId',
        comparisonType: 'Equal',
        compareTo: 'valueFromNode',
        secondFieldUserValue: '',
        secondFieldNodeValue: 'secondFieldNodeValue',
        secondFieldNodeId: 'secondFieldNodeId',
        secondFieldTimeDays: null,
        secondFieldTimeMonths: null,
        secondFieldTimeYears: null,
        secondFieldTimeExecutionTime: null,
        secondFieldTimeDateType: null,
        secondFieldTimeDate: null,
      },
    };
    const facedSpyConditional = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(conditionalNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facedSpyConditional });
    injectDependencies();

    component.ngOnInit();
    expect(component.bodyVisible).toBeFalse();
    expect(component.urlVisible).toBeFalse();
    expect(component.authVisible).toBeFalse();
    expect(component.argumentsVisible).toBeFalse();
    expect(component.inviteVisible).toBeFalse();
    expect(component.isTrigger).toBeFalse();
    expect(component.conditionalVisible).toBeTrue();
    expect(component.selectedNode).toEqual(conditionalNode);
    expect(component.nodeEditForm.value.conditionForm.compareTo).toEqual(conditionalNode.expression.compareTo);
    expect(component.nodeEditForm.value.conditionForm.comparisonType).toEqual(
      conditionalNode.expression.comparisonType
    );
    expect(component.nodeEditForm.value.conditionForm.firstFieldValue).toEqual(
      conditionalNode.expression.firstFieldValue
    );
    expect(component.nodeEditForm.value.conditionForm.firstFieldNodeId).toEqual(
      conditionalNode.expression.firstFieldNodeId
    );
    expect(component.nodeEditForm.value.conditionForm.secondFieldNodeValue).toEqual(
      conditionalNode.expression.secondFieldNodeValue
    );
    expect(component.nodeEditForm.value.conditionForm.secondFieldNodeId).toEqual(
      conditionalNode.expression.secondFieldNodeId
    );
    expect(component.nodeEditForm.value.conditionForm.secondFieldUserValue).toEqual('');
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeDate).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeMonths).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeYears).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeDate).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeExecutionTime).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldTimeDateType).toEqual(null);

    component.conditionForm.controls['firstFieldValue'].setValue(
      "Dear whoever is reading this, you're beautiful and someone out there is crazy about you"
    );
    component.saveNode();

    const expectedParam: IConditionNode = {
      ...conditionalNode,
      expression: {
        ...conditionalNode.expression,
        firstFieldValue: "Dear whoever is reading this, you're beautiful and someone out there is crazy about you",
      } as IExpression,
    };
    expect(graphEditorFacadeSpy.updateNode).toHaveBeenCalledWith(expectedParam);
  });

  it('should load a condition node with user type', () => {
    const conditionalNode = {
      ...presets.node1,
      expression: {
        firstFieldValue: 'firstFieldValue',
        firstFieldNodeId: 'firstFieldNodeId',
        comparisonType: ConditionTypeEnum.EQUAL,
        compareTo: ComparisonOptionsEnum.USER_VALUE,
        secondFieldUserValue: 'secondFieldUserValue',
      } as IExpression,
    };
    const facedSpyConditional = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(conditionalNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facedSpyConditional });
    injectDependencies();

    component.ngOnInit();
    expect(component.nodeEditForm.value.conditionForm.secondFieldUserValue).toEqual(
      conditionalNode.expression.secondFieldUserValue
    );
    expect(component.nodeEditForm.value.conditionForm.secondFieldNodeValue).toEqual(null);
    expect(component.nodeEditForm.value.conditionForm.secondFieldNodeId).toEqual(null);
  });

  it('should load a condition node with calendar type', () => {
    const conditionalNode = {
      ...presets.node1,
      expression: {
        firstFieldValue: 'firstFieldValue',
        firstFieldNodeId: 'firstFieldNodeId',
        comparisonType: ConditionTypeEnum.EQUAL,
        compareTo: ComparisonOptionsEnum.TIME_VALUE,
        secondFieldUserValue: 'secondFieldUserValue',
        secondFieldTimeDays: 0,
        secondFieldTimeMonths: 0,
        secondFieldTimeYears: 0,
        secondFieldTimeDate: DateTypeEnum.EXECUTION_DATE,
        // Before/ After/ exactly
        secondFieldTimeExecutionTime: ExecutionTimeEnum.EXACTLY_AT,
      } as IExpression,
    };
    const facedSpyConditional = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(conditionalNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facedSpyConditional });
    injectDependencies();

    component.loadEditMenuValues(conditionalNode);
  });

  it('should load a trigger node of WEEKLY interval, edit it and save it', () => {
    const triggerNode = {
      ...presets.node5,
      schedule: '0 12 * * 2,5',
    };
    const facadeSpyTrigger = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(triggerNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facadeSpyTrigger });
    injectDependencies();

    component.ngOnInit();
    expect(component.nodeEditForm.value.triggerForm.interval).toEqual(IntervalsEnum.WEEKLY);
    expect(component.nodeEditForm.value.triggerForm.repeatOn).toEqual([DayEnum.TUESDAY, DayEnum.FRIDAY]);
    expect(component.nodeEditForm.value.triggerForm.time).toEqual(12);

    component.triggerForm.controls['time'].setValue(13);
    component.saveNode();

    const expectedParam: ITriggerNode = {
      ...triggerNode,
      schedule: '0 13 * * 2,5',
    };
    expect(graphEditorFacadeSpy.updateNode).toHaveBeenCalledWith(expectedParam);
  });

  it('should load a trigger node of MONTHLY interval', () => {
    const triggerNode = {
      ...presets.node5,
      schedule: '0 13 5 * *',
    };
    const facadeSpyTrigger = jasmine.createSpyObj('GraphEditorFacade', ['deselectNode', 'updateNode'], {
      selectedNode$: of(triggerNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facadeSpyTrigger });
    injectDependencies();

    component.ngOnInit();
    expect(component.nodeEditForm.value.triggerForm.interval).toEqual(IntervalsEnum.MONTHLY);
    expect(component.nodeEditForm.value.triggerForm.monthRepeat).toEqual(5);
    expect(component.nodeEditForm.value.triggerForm.time).toEqual(13);
  });

  it('should load a invite node', () => {
    //TODO when insocial node is implemented finish this
  });

  it('should throw and error when deleting a null node', () => {
    injectDependencies();
    const error = new Error('No node selected');
    expect(() => component.deleteNode()).toThrow(error);
  });

  it('should throw and error when deleting a null node', () => {
    injectDependencies();
    const error = new Error('No node selected');
    expect(() => component.deleteNode()).toThrow(error);
  });

  it('should delete a node', () => {
    const triggerNode = {
      ...presets.node5,
      schedule: '0 12 * * 2,5',
    };
    const facadeSpyTrigger = jasmine.createSpyObj('GraphEditorFacade', ['removeNode', 'deselectNode', 'updateNode'], {
      selectedNode$: of(triggerNode),
    });
    TestBed.overrideProvider(GraphEditorFacade, { useValue: facadeSpyTrigger });
    injectDependencies();

    component.deleteNode();
    expect(graphEditorFacadeSpy.removeNode).toHaveBeenCalledWith(triggerNode.id);
    expect(graphEditorFacadeSpy.deselectNode).toHaveBeenCalled();
  });

  it('should generate the correct body string', () => {
    injectDependencies();
    const inviteFromValue = {
      surveyId: 'survey123',
      template: 'template123',
      subject: 'Subject',
      fromName: 'Sender',
      fromEmail: 'sender@example.com',
    };
    component.inviteFrom.setValue(inviteFromValue);

    const result = component.getBodyFromInviteConfig();

    const expectedBodyString = `{"template":"template123","subject":"Subject","fromName":"Sender","fromEmail":"sender@example.com","invites":<<email_data>>}`;
    expect(result).toEqual(expectedBodyString);
  });

  function injectDependencies() {
    fixture = TestBed.createComponent(FormDropListComponent);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    untypedFormBuilderSpy = TestBed.inject(UntypedFormBuilder) as jasmine.SpyObj<UntypedFormBuilder>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
