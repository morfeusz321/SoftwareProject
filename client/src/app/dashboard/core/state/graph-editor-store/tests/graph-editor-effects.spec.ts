import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { of } from 'rxjs';
import { IActionNode, IConditionNode, INode, ITriggerNode } from '@app/shared/interfaces/node/node.interface';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import * as GraphEditorActions from '@app/dashboard/core/state/graph-editor-store/graph-editor.actions';
import { GraphEditorEffects } from '@app/dashboard/core/state/graph-editor-store/graph-editor.effects';
import { UuidService } from '@app/shared/services/uuid-generator/uuid.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiGraphEditorService } from '@app/dashboard/graph-editor/services/graph-editor-api-service/graph-editor-api-service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConditionTypeEnum } from '@app/shared/enums/condition-type.enum';
import { IExpression } from '@app/shared/interfaces/condition/condition.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { Edge } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { MethodsEnum } from '@app/shared/enums/methods.enum';
import { AuthenticationTypeEnum } from '@app/shared/enums/authentication-type.enum';
import { IAuthentication } from '@app/shared/interfaces/auth/authentication.interface';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import * as presets from './../../../../../shared/testing_presets/testing_presets';

describe('GraphEditorEffects', () => {
  const node1: INode = presets.node1;
  const node2: INode = presets.node2;
  const node3: INode = presets.node3;
  const node4: INode = presets.node4;
  const node5: INode = presets.node5;
  const graph: IGraph = {
    id: 1,
    name: 'graph',
    nodes: [node1, node2, node3, node4],
    isDraft: true,
    isActive: true,
    schedule: '1*111',
  };

  let actions$: any;
  let effects: GraphEditorEffects;
  let graphEditorFacadeSpy: jasmine.SpyObj<GraphEditorFacade>;
  let uuidServiceSpy: jasmine.SpyObj<UuidService>;
  let apiGraphEditorServiceSpy: jasmine.SpyObj<ApiGraphEditorService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const facadeSpy = jasmine.createSpyObj('GraphEditorFacade', ['addNode', 'removeNode']);
    const uuidSpy = jasmine.createSpyObj('UuidService', ['generateUUID']);
    const apiGraphEditorSpy = jasmine.createSpyObj('ApiGraphEditorService', ['saveGraph', 'getGraph']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        GraphEditorEffects,
        HttpClientModule,
        provideMockActions(() => actions$),
        {
          provide: GraphEditorFacade,
          useValue: { ...facadeSpy, nodes$: of([node1, node2, node3, node4, node5]), graph$: of(graph) },
        },
        { provide: UuidService, useValue: uuidSpy },
        { provide: ApiGraphEditorService, useValue: apiGraphEditorSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    });

    effects = TestBed.inject(GraphEditorEffects);
    graphEditorFacadeSpy = TestBed.inject(GraphEditorFacade) as jasmine.SpyObj<GraphEditorFacade>;
    uuidServiceSpy = TestBed.inject(UuidService) as jasmine.SpyObj<UuidService>;
    apiGraphEditorServiceSpy = TestBed.inject(ApiGraphEditorService) as jasmine.SpyObj<ApiGraphEditorService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('addNewNode$', () => {
    it('should dispatch addNodeSuccess action conditional', () => {
      const resultNode: IConditionNode = {
        ...node1,
        name: 'mock',
        id: 'mocked-uuid',
        type: ConditionalTypeEnum.IF,
        expression: {
          firstFieldValue: '',
          firstFieldNodeId: '',
          comparisonType: ConditionTypeEnum.EQUAL,
          compareTo: null,
          secondFieldUserValue: '',
          secondFieldNodeValue: '',
          secondFieldNodeId: '',
          secondFieldTimeDays: 0,
          secondFieldTimeMonths: 0,
          secondFieldTimeYears: 0,
          secondFieldTimeDate: '',
          // Before/ After/ exactly
          secondFieldTimeExecutionTime: null,
        } as IExpression,
      };
      const expectedAction = GraphEditorActions.addNodeSuccess({ node: resultNode });

      actions$ = of(
        GraphEditorActions.addNode({
          position: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
          },
          nodeConfig: { method: ConditionalTypeEnum.IF },
        })
      );
      uuidServiceSpy.generateUUID.and.returnValue('mocked-uuid');
      effects.addNewNode$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch addNodeSuccess action action', () => {
      const resultNode: IActionNode = {
        ...node1,
        name: 'mock',
        id: 'mocked-uuid',
        type: MethodsEnum.POST,
        request: {
          method: MethodsEnum.POST,
          url: '',
          body: '{}',
          auth: {
            type: AuthenticationTypeEnum.NONE,
            token: '',
          } as IAuthentication,
        } as IRequest,
        arguments: [],
      };
      const expectedAction = GraphEditorActions.addNodeSuccess({ node: resultNode });

      actions$ = of(
        GraphEditorActions.addNode({
          position: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
          },
          nodeConfig: { method: MethodsEnum.POST },
        })
      );
      uuidServiceSpy.generateUUID.and.returnValue('mocked-uuid');
      effects.addNewNode$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch addNodeSuccess action trigger', () => {
      const resultNode: ITriggerNode = {
        ...node1,
        name: 'mock',
        id: 'mocked-uuid',
        type: ConditionalTypeEnum.TRIGGER,
        schedule: '',
      };
      const expectedAction = GraphEditorActions.addNodeSuccess({ node: resultNode });

      actions$ = of(
        GraphEditorActions.addNode({
          position: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
          },
          nodeConfig: { method: ConditionalTypeEnum.TRIGGER },
        })
      );
      uuidServiceSpy.generateUUID.and.returnValue('mocked-uuid');
      effects.addNewNode$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch addNodeFailure action', () => {
      const error = new Error('Error');
      const expectedAction = GraphEditorActions.addNodeFailure({ error });

      actions$ = of(
        GraphEditorActions.addNode({
          position: {
            positionX: 0,
            positionY: 0,
            positionZ: 0,
          },
          nodeConfig: { method: ConditionalTypeEnum.IF },
        })
      );
      uuidServiceSpy.generateUUID.and.throwError(error);
      effects.addNewNode$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
  });

  describe('connectNodes$', () => {
    it('should dispatch connectNodesSuccess action', () => {
      const updatedSourceNode: INode = {
        ...node1,
        neighbours: ['2'],
      };
      const expectedAction = GraphEditorActions.connectNodesSuccess({
        updatedSourceNode,
        createdEdge: { from: node1.id, to: node2.id },
      });

      actions$ = of(GraphEditorActions.connectNodes({ source: node1.id, target: node2.id }));
      effects.connectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch connectNodesFailure action connect to itself', () => {
      const error = new Error('Cannot connect node to itself');
      const expectedAction = GraphEditorActions.connectNodesFailure({ error });

      actions$ = of(GraphEditorActions.connectNodes({ source: node1.id, target: node1.id }));
      graphEditorFacadeSpy.addNode.and.throwError(error);
      effects.connectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch connectNodesFailure action source not found', () => {
      const node: INode = node1;
      const error = new Error('Source or target node not found');
      toastrServiceSpy.error.and.returnValue(null);
      const expectedAction = GraphEditorActions.connectNodesFailure({ error });

      actions$ = of(GraphEditorActions.connectNodes({ source: 'non-existent-id', target: node.id }));
      graphEditorFacadeSpy.addNode.and.throwError(error);
      effects.connectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch connectNodesFailure action neighbour cycle', () => {
      const error = new Error('Cannot create a cycle');
      toastrServiceSpy.error.and.returnValue(null);
      const expectedAction = GraphEditorActions.connectNodesFailure({ error });

      actions$ = of(GraphEditorActions.connectNodes({ source: node4.id, target: node3.id }));
      graphEditorFacadeSpy.addNode.and.throwError(error);
      effects.connectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch connectNodesFailure action neighbour cycle', () => {
      const error = new Error('Cannot create a cycle');
      toastrServiceSpy.error.and.returnValue(null);
      const expectedAction = GraphEditorActions.connectNodesFailure({ error });

      actions$ = of(GraphEditorActions.connectNodes({ source: node2.id, target: node5.id }));
      graphEditorFacadeSpy.addNode.and.throwError(error);
      effects.connectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
  });

  describe('disconnectNodes$', () => {
    it('should dispatch disconnectNodesSuccess action', () => {
      const sourceNode: INode = node3;
      const targetNode: INode = node4;
      const expectedAction = GraphEditorActions.disconnectNodesSuccess({
        source: sourceNode.id,
        target: targetNode.id,
      });

      actions$ = of(GraphEditorActions.disconnectNodes({ source: sourceNode.id, target: targetNode.id }));
      effects.disconnectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch disconnectNodesFailure action target not found', () => {
      const sourceNode: INode = node3;
      const targetNode: INode = { ...node1, id: '6' };
      const expectedAction = GraphEditorActions.disconnectNodesFailure({
        error: 'Source or target node not found',
      });

      actions$ = of(GraphEditorActions.disconnectNodes({ source: sourceNode.id, target: targetNode.id }));
      effects.disconnectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    it('should dispatch disconnectNodesFailure action target not found', () => {
      const sourceNode: INode = node1;
      const targetNode: INode = node4;
      const expectedAction = GraphEditorActions.disconnectNodesFailure({
        error: 'Nodes not connected',
      });

      actions$ = of(GraphEditorActions.disconnectNodes({ source: sourceNode.id, target: targetNode.id }));
      effects.disconnectNodes$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });
  });

  describe('saveGraph$', () => {
    it('should dispatch saveGraphSuccess action', () => {
      apiGraphEditorServiceSpy.saveGraph.and.returnValue(of({} as IGraph));
      toastrServiceSpy.success.and.returnValue(null);

      const expectedAction = GraphEditorActions.saveGraphSuccess();

      actions$ = of(GraphEditorActions.saveGraph());
      effects.saveGraph$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    // TODO Figure out a way to catch service error
    // it('should dispatch saveGraphFailure action', () => {
    //   const error =  new Error("scary error boooooooooooooooooooo")
    //   apiGraphEditorServiceSpy.saveGraph.withArgs(graph).and.throwError(error);
    //
    //   const expectedAction = GraphEditorActions.saveGraphFailure({error: "scary error boooooooooooooooooooo"});
    //
    //   actions$ = of(GraphEditorActions.saveGraph());
    //   effects.saveGraph$.subscribe((action) => {
    //     expect(action).toEqual(expectedAction);
    //   });
    // });
  });

  describe('loadGraph$', () => {
    it('should dispatch loadGraphSuccess action', () => {
      apiGraphEditorServiceSpy.getGraph.and.returnValue(of(graph));
      const edges: Edge[] = [
        { from: '3', to: '2' },
        { from: '3', to: '4' },
      ];

      const expectedAction = GraphEditorActions.loadGraphSuccess({ graph, edges });

      actions$ = of(GraphEditorActions.loadGraph({ graphId: graph.id }));
      effects.loadGraph$.subscribe((action) => {
        expect(action).toEqual(expectedAction);
      });
    });

    // TODO Figure out a way to catch service error
    // it('should dispatch loadGraphFailure action', () => {
    //   const error =  new Error("error so scary")
    //   apiGraphEditorServiceSpy.getGraph.and.throwError(error);
    //
    //   const expectedAction = GraphEditorActions.loadGraphFailure({error: "error so scary"});
    //
    //   actions$ = of(GraphEditorActions.loadGraph({graphId: graph.id}));
    //   effects.loadGraph$.subscribe((action) => {
    //     expect(action).toEqual(expectedAction);
    //   });
    // });
  });
});
