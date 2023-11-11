import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConditionalFormComponent } from './conditional-form.component';
import {GraphEditorFacade} from "@app/dashboard/core/state/graph-editor-store/graph-editor.facade";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {ComparisonOptionsEnum} from "@app/shared/enums/comparison-options.enum";
import {INode} from "@app/shared/interfaces/node/node.interface";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import any = jasmine.any;
import * as presets from "./../../../../shared/testing_presets/testing_presets"
import {TranslocoTestingModule} from "@ngneat/transloco";
import { numberValidator } from "@app/shared/validators/form-validators";
import {MatDialogModule} from "@angular/material/dialog";

describe('ConditionalFormComponent', () => {
  let component: ConditionalFormComponent;
  let fixture: ComponentFixture<ConditionalFormComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;
  let selectedNode: INode;

  const node1: INode = presets.node1;
  const node2: INode = presets.node2;
  const node3: INode = presets.node3;
  const node4: INode = presets.node6;
  const fb = new FormBuilder()

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.group({
      firstFieldValue: ['', Validators.required],
      firstFieldNodeId: ['', Validators.required],
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
    })
  });

  beforeEach(async () => {
    selectedNode = node4;
    const facadeSpy = jasmine.createSpyObj(
      'GraphEditorFacade',
      ['loadGraph', 'updateIsLoading', 'highlightNode'],
      {
        selectedNode$: of(selectedNode),
        isLoading$: of(false),
        nodes$: of([node1, node2, node3])
      }
    );
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoTestingModule,
        MatDialogModule
      ],
      declarations: [ConditionalFormComponent],
      providers: [
        FormBuilder,
        {provide: GraphEditorFacade, useValue: facadeSpy},
        {provide: FormGroupDirective, useValue: formGroupDirective}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConditionalFormComponent);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly compare nodes', () => {
    expect(component.compareNodes(node1, null)).toEqual(false)
    expect(component.compareNodes(node1, node1)).toEqual(true)
  });

  it('should change the form controls', () => {
    const arg = (formGroupDirectiveSpy.form.controls['test'] as FormGroup);
    component.ngOnInit();

    expect(component.conditionForm).toBeDefined();
    expect(component.conditionForm).toBeInstanceOf(FormGroup);

    arg.controls['compareTo'].setValue(ComparisonOptionsEnum.USER_VALUE);
    expect(arg.controls['secondFieldNodeValue'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldNodeId'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldUserValue'].disabled).toBeFalsy();
    expect(arg.controls['secondFieldTimeDays'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeMonths'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeYears'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeExecutionTime'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeDateType'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeDate'].disabled).toBeTruthy();

    arg.controls['compareTo'].setValue(ComparisonOptionsEnum.NODE_VALUE);
    expect(arg.controls['secondFieldNodeValue'].disabled).toBeFalsy();
    expect(arg.controls['secondFieldNodeId'].disabled).toBeFalsy();
    expect(arg.controls['secondFieldUserValue'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeDays'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeMonths'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeYears'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeExecutionTime'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeDateType'].disabled).toBeTruthy();
    expect(arg.controls['secondFieldTimeDate'].disabled).toBeTruthy();
  });


    it('filter no selected should throw error', () => {
    component.ngOnInit();
    component.selectedNode = null;
    expect(() => component.filterNodes()).toThrow(any(Error));
  });

  it('It should filter selected nodes and highlight the selected one', () => {
    component.ngOnInit();
    fixture.detectChanges();
    component.filterNodes();
    expect(component.nodesWithoutSelectedNode).toEqual([node2, node3]);
    fixture.detectChanges();
    component.highlightNode(node2.id);
    fixture.detectChanges();

    component.options.forEach(option => {
      expect(option.active).toEqual(false);
    });
  });
})
