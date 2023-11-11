import { Injectable } from '@angular/core';
import { catchError, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GraphEditorActions from '@app/dashboard/core/state/graph-editor-store/graph-editor.actions';
import {
  IActionNode,
  IConditionNode,
  IInsocialNode,
  IMapNode,
  INode,
  ITriggerNode,
} from '@app/shared/interfaces/node/node.interface';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { UuidService } from '@app/shared/services/uuid-generator/uuid.service';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { ApiGraphEditorService } from '@app/dashboard/graph-editor/services/graph-editor-api-service/graph-editor-api-service';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import { IExpression, IMapExpression } from '@app/shared/interfaces/condition/condition.interface';
import { IAuthentication } from '@app/shared/interfaces/auth/authentication.interface';
import { AuthenticationTypeEnum } from '@app/shared/enums/authentication-type.enum';
import { ConditionTypeEnum } from '@app/shared/enums/condition-type.enum';
import { Edge } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { ToastrService } from 'ngx-toastr';
import { IArgument } from '@app/shared/interfaces/argument/argument.interface';
import { DateTypeEnum } from '@app/shared/enums/date-type.enum';
import { ExecutionTimeEnum } from '@app/shared/enums/execution-time.enum';

@Injectable()
export class GraphEditorEffects {
  readonly dateType = DateTypeEnum;
  readonly executionTime = ExecutionTimeEnum;

  /**
   * Method to indicate if adding new edge will create a cycle in the graph
   * @param startNode - the node from which the edge will start
   * @param targetNode - the node to which the edge will point
   * @param nodes - all nodes in the graph
   * @returns true if adding the edge will create a cycle, false otherwise
   */
  private findCycle = (startNode: INode, targetNode: INode, nodes: INode[]): boolean => {
    const nodesMap: Map<string, INode> = new Map<string, INode>();
    nodes.forEach((node) => nodesMap.set(node.id, node));
    const visited: Set<string> = new Set<string>();
    const queue: INode[] = [];
    queue.push(startNode);
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode) {
        if (currentNode.id === targetNode.id) {
          return true;
        }
        if (!visited.has(currentNode.id)) {
          visited.add(currentNode.id);
          const neighbours = currentNode.neighbours;
          neighbours.forEach((neighbor: string) => {
            queue.push(nodesMap.get(neighbor));
          });
        }
      }
    }
    return false;
  };

  /**
   * Effect for adding new node to the graph, based on the node type.
   */
  // TODO: refactor this effect to be more readable and extract the logic and default node values to separate functions
  addNewNode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphEditorActions.addNode),
      switchMap(({ nodeConfig, position }) => {
        const id = this.uuidService.generateUUID();
        let basicNode: INode = {
          name: id.slice(0, 4),
          id: id,
          neighbours: [],
          position,
          type: nodeConfig.method,
        };
        let newConditionNode: IConditionNode;
        let newInsocialNode: IInsocialNode;
        let newActionNode: IActionNode;
        if (nodeConfig.method in MethodsEnum) {
          const request: IRequest = nodeConfig.action
            ? nodeConfig.action.request
            : ({
                method: nodeConfig.method,
                url: '',
                body: '{}',
                auth: {
                  type: AuthenticationTypeEnum.NONE,
                  token: '',
                } as IAuthentication,
              } as IRequest);

          newActionNode = {
            ...basicNode,
            request,
            name: nodeConfig.action ? nodeConfig.action.name : basicNode.name,
            arguments: [],
          };
          return of(GraphEditorActions.addNodeSuccess({ node: newActionNode }));
        } else if (nodeConfig.method in InsocialMethodsEnum) {
          newInsocialNode = {
            ...basicNode,
            request: {} as IRequest,
            arguments: [],
            email: {} as IArgument,
          };
          return of(GraphEditorActions.addNodeSuccess({ node: newInsocialNode }));
        } else if (nodeConfig.method === ConditionalTypeEnum.TRIGGER) {
          const triggerNode: ITriggerNode = {
            ...basicNode,
            type: nodeConfig.method as ConditionalTypeEnum,
            schedule: '',
          };
          return of(GraphEditorActions.addNodeSuccess({ node: triggerNode }));
        } else if (nodeConfig.method === ConditionalTypeEnum.MAP) {
          const mapNode: IMapNode = {
            ...basicNode,
            type: nodeConfig.method as ConditionalTypeEnum,
            mapExpression: {
              fieldName: '',
              parentNodeId: '',
              mappedFieldName: '',
            } as IMapExpression,
          };
          return of(GraphEditorActions.addNodeSuccess({ node: mapNode }));
        } else if (nodeConfig.method in ConditionalTypeEnum) {
          newConditionNode = {
            ...basicNode,
            type: nodeConfig.method as ConditionalTypeEnum,
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
          return of(GraphEditorActions.addNodeSuccess({ node: newConditionNode }));
        } else {
          return of(GraphEditorActions.addNodeFailure({ error: new Error('Invalid node type') }));
        }
      }),
      catchError((error) => of(GraphEditorActions.addNodeFailure({ error })))
    )
  );

  /**
   * Effect for connecting two nodes.
   */
  connectNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphEditorActions.connectNodes),
      withLatestFrom(this.graphEditorFacade.nodes$),
      switchMap(([{ source, target }, nodes]) => {
        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);
        if (!sourceNode || !targetNode) {
          return of(GraphEditorActions.connectNodesFailure({ error: new Error('Source or target node not found') }));
        }
        if (sourceNode.id === targetNode.id) {
          return of(GraphEditorActions.connectNodesFailure({ error: new Error('Cannot connect node to itself') }));
        }
        if (targetNode.neighbours.includes(sourceNode.id)) {
          return of(GraphEditorActions.connectNodesFailure({ error: new Error('Cannot create a cycle') }));
        }
        if (this.findCycle(targetNode, sourceNode, nodes)) {
          return of(GraphEditorActions.connectNodesFailure({ error: new Error('Cannot create a cycle') }));
        }
        const updatedSourceNode = {
          ...sourceNode,
          neighbours: [...sourceNode.neighbours, targetNode.id],
        };
        return of(
          GraphEditorActions.connectNodesSuccess({ updatedSourceNode, createdEdge: { from: source, to: target } })
        );
      })
    )
  );

  /**
   * Effect for disconnecting two nodes.
   */
  disconnectNodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphEditorActions.disconnectNodes),
      withLatestFrom(this.graphEditorFacade.nodes$),
      switchMap(([{ source, target }, nodes]) => {
        const sourceNode = nodes.find((node) => node.id === source);
        const targetNode = nodes.find((node) => node.id === target);
        if (!sourceNode || !targetNode) {
          return of(GraphEditorActions.disconnectNodesFailure({ error: 'Source or target node not found' }));
        }
        const existingNeighbour = sourceNode.neighbours.find((neighbour) => neighbour === targetNode.id);
        if (!existingNeighbour) {
          return of(GraphEditorActions.disconnectNodesFailure({ error: 'Nodes not connected' }));
        }
        return of(GraphEditorActions.disconnectNodesSuccess({ source, target }));
      })
    )
  );

  /**
   * Effect for saving the graph.
   */
  saveGraph$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphEditorActions.saveGraph),
      withLatestFrom(this.graphEditorFacade.graph$),
      switchMap(([_, graph]) => {
        return this.apiGraphEditorService.saveGraph(graph).pipe(
          take(1),
          map(() => {
            this.messages.success('Graph saved as ready', 'Success');
            return GraphEditorActions.saveGraphSuccess();
          }),
          catchError((error) => of(GraphEditorActions.saveGraphFailure({ error: error.error.detail ? error.error.detail : error.message })))
        );
      })
    )
  );

  /**
   * Effect for loading the graph.
   */
  loadGraph$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphEditorActions.loadGraph),
      withLatestFrom(this.graphEditorFacade.graph$),
      switchMap(([typedGraphId]) => {
        return this.apiGraphEditorService.getGraph(typedGraphId.graphId).pipe(
          take(1),
          map((graph) => {
            let edges: Edge[] = [];
            graph.nodes.map((node) => node.neighbours.map((neighbour) => edges.push({ from: node.id, to: neighbour })));
            return GraphEditorActions.loadGraphSuccess({ graph, edges });
          }),
          catchError((error) => of(GraphEditorActions.loadGraphFailure({ error: error.error.detail ? error.error.detail : error.message })))
        );
      })
    )
  );

  /**
   * Effect for loading the graph.
   * @param actions$ - Actions stream
   * @param graphEditorFacade - Graph editor facade
   * @param uuidService - UUID service
   * @param apiGraphEditorService - API graph editor service
   * @param messages - Toastr service
   */
  constructor(
    private actions$: Actions,
    private graphEditorFacade: GraphEditorFacade,
    private uuidService: UuidService,
    private apiGraphEditorService: ApiGraphEditorService,
    private messages: ToastrService
  ) {}
}
