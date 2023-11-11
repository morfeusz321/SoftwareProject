import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormGroup,
  FormGroupDirective,
  Validators,
  FormBuilder,
  FormsModule,
} from '@angular/forms';
import { MapFormComponent } from './map-form.component';
import { node1, node2 } from '@app/shared/testing_presets/testing_presets';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MapFormComponent', () => {
  let component: MapFormComponent;
  let fixture: ComponentFixture<MapFormComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let formGroupDirectiveSpy: jasmine.SpyObj<FormGroupDirective>;
  let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
  const nodeOne = node1;
  const nodeTwo = node2;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.group({
      fieldName: ['', Validators.required],
      parentNodeId: ['', Validators.required],
      mappedFieldName: ['', Validators.required],
    }),
  });
  beforeEach(async () => {
    const formBuilder = new FormBuilder();
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['highlightNode', 'clearHighlighted'], {
      nodes$: of([nodeOne, nodeTwo]),
      selectedNode$: of(nodeOne),
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslocoTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: GraphEditorFacade,
          useValue: facadeSpy,
        },
        { provide: FormGroupDirective, useValue: formGroupDirective },
        { provide: FormBuilder, useValue: formBuilder },
      ],
      declarations: [MapFormComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MapFormComponent);
    formGroupDirectiveSpy = TestBed.inject(FormGroupDirective) as jasmine.SpyObj<FormGroupDirective>;
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    formBuilderSpy = TestBed.inject(FormBuilder) as jasmine.SpyObj<FormBuilder>;
    component = fixture.componentInstance;
    component.formGroupName = 'test';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.mapForm).toBeInstanceOf(FormGroup);
    expect(component.nodes).toEqual([nodeOne, nodeTwo]);
    expect(component.selectedNode).toEqual(nodeOne);
  });

  it('should filter nodes correctly when selectedNode is defined', () => {
    component.options = [
      { id: '2', name: 'test', setInactiveStyles: () => {} },
      { id: '1', name: 'test', setInactiveStyles: () => {} },
    ] as any;
    spyOn(component.options, 'forEach').and.callThrough();
    spyOn(component.options[0], 'setInactiveStyles').and.callThrough();
    spyOn(component.options[1], 'setInactiveStyles').and.callThrough();
    component.filterNodes();

    expect(component.nodesWithoutSelectedNode).toEqual([nodeTwo]);
    expect(component.options.forEach).toHaveBeenCalled();
    component.options.forEach((option) => {
      expect(option.setInactiveStyles).toHaveBeenCalled();
    });
  });

  it('should throw an error when filterNodes is called with no selectedNode', () => {
    component.selectedNode = null;
    expect(() => {
      component.filterNodes();
    }).toThrowError('No node selected');
  });

  it('should call clear highlight node when clearHighlightNode is called', () => {
    component.clearHighlighted();
    expect(graphEditorFacadeSpy.clearHighlighted).toHaveBeenCalled();
  });

  it('should handle highlight node properly', () => {
    component.options = [
      { id: '2', name: 'test', setInactiveStyles: () => {} },
      { id: '1', name: 'test', setInactiveStyles: () => {} },
    ] as any;
    spyOn(component.options, 'forEach').and.callThrough();
    spyOn(component.options[0], 'setInactiveStyles').and.callThrough();
    spyOn(component.options[1], 'setInactiveStyles').and.callThrough();
    component.highlightNode('1');
    expect(graphEditorFacadeSpy.highlightNode).toHaveBeenCalledWith('1');
    expect(component.options.forEach).toHaveBeenCalled();
    component.options.forEach((option) => {
      expect(option.setInactiveStyles).toHaveBeenCalled();
    });
  });
});
