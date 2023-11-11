import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NodeEditMenuComponent } from './node-edit-menu.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';

describe('NodeEditMenuComponent', () => {
  let component: NodeEditMenuComponent;
  let route: ActivatedRoute;
  let fixture: ComponentFixture<NodeEditMenuComponent>;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let node: INode;

  beforeEach(async () => {
    node = null;
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['loadGraph', 'updateIsLoading'], {
      selectedNode$: of(node),
      isLoading$: of(false),
      isDirty$: of(false),
    });
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['warning']);
    const translocoServiceSpy = jasmine.createSpyObj('TranslocoService', ['translate']);
    await TestBed.configureTestingModule({
      declarations: [NodeEditMenuComponent],
      providers: [
        { provide: GraphEditorFacade, useValue: facadeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
          },
        },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslocoService, useValue: translocoServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeEditMenuComponent);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should load graph and set newGraph to false when id is present in params', () => {
    graphEditorFacadeSpy.updateIsLoading.and.returnValue(null);
    graphEditorFacadeSpy.loadGraph.and.returnValue(null);
    component.ngOnInit();

    expect(graphEditorFacadeSpy.updateIsLoading).toHaveBeenCalledWith(true);
    expect(graphEditorFacadeSpy.loadGraph).toHaveBeenCalledWith(1);
    expect(component.newGraph).toBe(false);
  });

  it('should set newGraph to true when id is not present in params', () => {
    graphEditorFacadeSpy.updateIsLoading.and.returnValue(null);
    graphEditorFacadeSpy.loadGraph.and.returnValue(null);
    route.params = of({}); // Simulate id not present
    component.ngOnInit();

    expect(component.newGraph).toBe(true);
  });
});
