import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgFormComponent } from './arg-form.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import any = jasmine.any;
import { INode } from '@app/shared/interfaces/node/node.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('ArgFormComponent', () => {
  let component: ArgFormComponent;
  let fixture: ComponentFixture<ArgFormComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;
  let selectedNode: INode;

  const node1: INode = {
    id: '1',
    name: 'test',
    neighbours: [],
    position: {
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    },
    type: ConditionalTypeEnum.IF,
  };
  const node2: INode = { ...node1, id: '2' };
  const node3: INode = { ...node1, id: '3', neighbours: ['2', '4'] };
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.group({
      arguments: fb.array([]),
    }),
  });

  beforeEach(async () => {
    selectedNode = null;
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['loadGraph', 'updateIsLoading', 'highlightNode'], {
      selectedNode$: of(selectedNode),
      isLoading$: of(false),
      nodes$: of([node1, node2, node3]),
    });
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
      declarations: [ArgFormComponent],
      providers: [
        { provide: GraphEditorFacade, useValue: facadeSpy },
        { provide: FormGroupDirective, useValue: formGroupDirective },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ArgFormComponent);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filter no selected should throw error', () => {
    component.ngOnInit();
    expect(() => component.filterNodes()).toThrow(any(Error));
  });

  it('It should filter selected nodes and highlight the selected one', () => {
    component.ngOnInit();
    component.selectedNode = node1;
    component.filterNodes();
    expect(component.nodesWithoutSelectedNode).toEqual([node2, node3]);
    fixture.detectChanges();
    component.highlightNode(node1.id);
    fixture.detectChanges();

    component.options.forEach((option) => {
      if (option.value === node1.id) {
        expect(option.active).toEqual(true);
      } else {
        expect(option.active).toEqual(false);
      }
    });
  });

  it('should add two argument and remove one', () => {
    const arg = formGroupDirectiveSpy.form.controls['test'] as FormGroup;
    component.ngOnInit();
    component.selectedNode = node1;
    fixture.detectChanges();
    component.addArgument();
    expect((arg.controls['arguments'] as FormArray).controls[0]).toBeDefined();
    expect(((arg.controls['arguments'] as FormArray).controls[0] as FormGroup).controls['alias'].value).toEqual('');
    expect(((arg.controls['arguments'] as FormArray).controls[0] as FormGroup).controls['parentId'].value).toEqual('');
    expect(((arg.controls['arguments'] as FormArray).controls[0] as FormGroup).controls['field'].value).toEqual('');
    component.addArgument();
    expect((arg.controls['arguments'] as FormArray).controls[0]).toBeDefined();
    expect((arg.controls['arguments'] as FormArray).controls[1]).toBeDefined();
    component.removeArgument(0);
    expect((arg.controls['arguments'] as FormArray).length).toEqual(1);
    component.removeArgument(0);
    expect((arg.controls['arguments'] as FormArray).length).toEqual(0);
  });

  it('filter no selected should throw error', () => {
    component.ngOnInit();
    component.selectedNode = null;
    expect(() => component.filterNodes()).toThrow(any(Error));
  });

})
