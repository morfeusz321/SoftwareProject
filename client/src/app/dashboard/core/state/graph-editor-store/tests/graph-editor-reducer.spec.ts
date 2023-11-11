import { INode } from '@app/shared/interfaces/node/node.interface';
import { initialState, reducer, State } from '@app/dashboard/core/state/graph-editor-store/graph-editor.reducer';
import * as GraphEditorActions from '@app/dashboard/core/state/graph-editor-store/graph-editor.actions';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { Edge } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import * as presets from '@app/shared/testing_presets/testing_presets';

const testNode: INode = presets.node1;

const initialTestState: State = {
  isLoading: false,
  nodes: [],
  edges: [],
  selectedNode: null,
  isDraft: false,
  isActive: false,
  lastSaved: '',
  schedule: '',
  error: '',
  graphId: -1,
  graphName: '',
  highlightedNode: null,
  isDirty: false,
};

const graph: IGraph = presets.graph1;
describe('GraphEditorReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const result = reducer(undefined, action);
      expect(result).toEqual(initialState);
      expect(result).toEqual(initialTestState);
    });
  });

  describe('update actions', () => {
    it('should update isLoading in the state', () => {
      const isLoading = true;
      const action = GraphEditorActions.updateIsLoading({ isLoading });
      const result = reducer(initialState, action);
      expect(result.isLoading).toEqual(isLoading);
    });

    it('should update isDraft in the state', () => {
      const isDraft = true;
      const action = GraphEditorActions.updateIsDraft({ isDraft });
      const result = reducer(initialState, action);
      expect(result.isDraft).toEqual(isDraft);
    });

    it('should update lastSaved in the state', () => {
      const lastSaved = '04.05.2023';
      const action = GraphEditorActions.updateLastSaved({ lastSaved });
      const result = reducer(initialState, action);
      expect(result.lastSaved).toEqual(lastSaved);
    });

    it('should update isActive in the state', () => {
      const isActive = true;
      const action = GraphEditorActions.updateIsActive({ isActive });
      const result = reducer(initialState, action);
      expect(result.isActive).toEqual(isActive);
    });
    it('should update node Position', () => {
      const node: INode = testNode;
      const position = { positionX: 1, positionY: 1, positionZ: 1 };
      const expectedNode: INode = { ...node, position };
      const state: State = { ...initialState, nodes: [node] };
      const action = GraphEditorActions.updateNodePosition({ id: node.id, position });
      const result = reducer(state, action);
      expect(result.nodes).toEqual([expectedNode]);
    });
    it('should update graphName', () => {
      const graphName = 'graphName';
      const action = GraphEditorActions.updateName({ name: graphName });
      const result = reducer(initialState, action);
      expect(result.graphName).toEqual(graphName);
    });
  });

  describe('selectNode action', () => {
    it('should update selectedNode in the state', () => {
      const node: INode = testNode;
      const state: State = {
        ...initialState,
        nodes: [node],
      };
      const action = GraphEditorActions.selectNode({ id: node.id });
      const result = reducer(state, action);
      expect(result.selectedNode).toEqual(node);
    });

    it('should set selectedNode to null if node with the given id does not exist', () => {
      const state: State = {
        ...initialState,
        selectedNode: testNode,
      };
      const action = GraphEditorActions.selectNode({ id: '2' });
      const result = reducer(state, action);
      expect(result.selectedNode).toBeNull();
    });
  });

  describe('deselectNode action', () => {
    it('should set selectedNode to null', () => {
      const state: State = {
        ...initialState,
        selectedNode: testNode,
      };
      const action = GraphEditorActions.deselectNode();
      const result = reducer(state, action);
      expect(result.selectedNode).toBeNull();
    });
  });

  describe('addNodeSuccess action', () => {
    it('should add the node to the state', () => {
      const node: INode = testNode;
      const action = GraphEditorActions.addNodeSuccess({ node });
      const result = reducer(initialState, action);
      expect(result.nodes).toEqual([node]);
    });
  });

  describe('removeNode action', () => {
    it('should remove the node from the state', () => {
      const node5: INode = presets.node5;
      const node2: INode = {
        ...testNode,
        id: '2',
        neighbours: [node5.id],
      };
      const updatedNode2: INode = {
        ...node2,
        neighbours: [],
      };
      const node3: INode = {
        ...testNode,
        id: '3',
        neighbours: [],
      };
      const state: State = {
        ...initialState,
        nodes: [node5, node2, node3],
        edges: [
          { from: '2', to: '5' },
          { from: '5', to: '3' },
        ],
      };
      const action = GraphEditorActions.removeNode({ id: node5.id });
      const result = reducer(state, action);
      expect(result.nodes).toEqual([updatedNode2, node3]);
      expect(result.nodes[0].neighbours).toEqual([]);
      expect(result.edges).toEqual([]);
    });
  });

  describe('updateNode action', () => {
    it('should update the node in the state', () => {
      const node: INode = testNode;
      const otherNode: INode = {
        ...testNode,
        id: '2',
      };
      const state: State = {
        ...initialState,
        nodes: [node, otherNode],
      };
      const updatedNode: INode = {
        ...node,
        position: {
          positionX: 1,
          positionY: 1,
          positionZ: 1,
        },
      };
      const action = GraphEditorActions.updateNode({ node: updatedNode });
      const result = reducer(state, action);
      expect(result.nodes).toEqual([updatedNode, otherNode]);
    });
  });

  describe('connectNodes action', () => {
    it('should add the edge to the state', () => {
      const node: INode = testNode;
      const node2: INode = { ...testNode, id: '2' };
      const state: State = {
        ...initialState,
        nodes: [node, node2],
      };
      const updatedSourceNode: INode = {
        ...node,
        neighbours: ['2'],
      };
      const action = GraphEditorActions.connectNodesSuccess({ updatedSourceNode, createdEdge: { from: '1', to: '2' } });
      const result = reducer(state, action);
      expect(result.nodes[0].neighbours).toEqual(['2']);
    });

    it('should update the error', () => {
      const error = 'error';
      const action = GraphEditorActions.connectNodesFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('disconnectNodes action', () => {
    it('should remove the edge', () => {
      const node1: INode = {
        ...testNode,
        neighbours: ['3'],
      };
      const node2: INode = {
        ...testNode,
        id: '2',
        neighbours: [node1.id],
      };
      const node3: INode = {
        ...testNode,
        id: '3',
      };
      const state: State = {
        ...initialState,
        nodes: [node1, node2, node3],
        edges: [
          { from: node1.id, to: node3.id },
          { from: node2.id, to: node1.id },
        ],
      };
      const action = GraphEditorActions.disconnectNodesSuccess({ source: node1.id, target: node3.id });
      const result = reducer(state, action);
      expect(result.edges).toEqual([{ from: node2.id, to: node1.id }]);
      expect(result.nodes[0].neighbours).toEqual([]);
    });

    it('should update the error', () => {
      const error = 'error';
      const action = GraphEditorActions.connectNodesFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('loadGraphSuccess action', () => {
    it('should load the graph fields', () => {
      const node: INode = testNode;
      const node2: INode = { ...testNode, id: '2' };
      const state: State = {
        ...initialState,
        isLoading: true,
      };
      const updatedSourceNode: INode = {
        ...node,
        neighbours: ['2'],
      };
      const updatedGraph: IGraph = {
        ...graph,
        nodes: [updatedSourceNode, node2],
      };
      const edges: Edge[] = [{ from: '1', to: '2' }];
      const action = GraphEditorActions.loadGraphSuccess({
        graph: updatedGraph,
        edges,
      });
      const result = reducer(state, action);
      expect(result.edges).toEqual(edges);
      expect(result.isDraft).toEqual(graph.isDraft);
      expect(result.isActive).toEqual(graph.isActive);
      expect(result.schedule).toEqual(graph.schedule);
      expect(result.graphId).toEqual(graph.id);
      expect(result.graphName).toEqual(graph.name);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('loadGraphFailure action', () => {
    it('should update the error', () => {
      const error = 'error';
      const state: State = {
        ...initialState,
        isLoading: true,
      };
      const action = GraphEditorActions.loadGraphFailure({ error });
      const result = reducer(state, action);
      expect(result.error).toEqual(error);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('saveGraphFailure action', () => {
    it('should update the error', () => {
      const error = 'error';
      const action = GraphEditorActions.saveGraphFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('disconnectNodesFailure action', () => {
    it('should update the error', () => {
      const error = 'error';
      const action = GraphEditorActions.disconnectNodesFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('highlightNode action', () => {
    it('should change highlighted id', () => {
      const id = 'id';
      const action = GraphEditorActions.highlightNode({ id });
      const result = reducer(initialState, action);
      expect(result.highlightedNode).toEqual(id);
    });
  });

  describe('clearHighlighted action', () => {
    it('should clear the highlighted node', () => {
      const state: State = {
        ...initialState,
        highlightedNode: 'id',
      };
      const action = GraphEditorActions.clearHighlighted();
      const result = reducer(state, action);
      expect(result.highlightedNode).toEqual(null);
    });
  });

  describe('reset store', () => {
    it('should reset the store', () => {
      const state: State = {
        ...initialState,
        highlightedNode: 'id',
      };
      const action = GraphEditorActions.reset();
      const result = reducer(state, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('resetError action', () => {
    it('should reset the error', () => {
      const state: State = {
        ...initialState,
        error: 'error',
      };
      const action = GraphEditorActions.resetError({ error: null });
      const result = reducer(state, action);
      expect(result.error).toEqual(null);
    });
  });
});
