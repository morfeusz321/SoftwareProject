import { INode } from '@app/shared/interfaces/node/node.interface';
import { Action, createReducer, on } from '@ngrx/store';
import * as GraphEditorActions from './graph-editor.actions';
import { Edge } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';

export const graphEditorFeatureKey = 'graph-editor';

export interface State {
  isLoading: boolean;
  nodes: INode[];
  edges: Edge[];
  selectedNode: INode | null;
  isDraft: boolean;
  isActive: boolean;
  lastSaved: string;
  schedule: string;
  error: string;
  graphId: number;
  graphName: string;
  highlightedNode: string | null;
  isDirty: boolean;
}

export const initialState: State = {
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

/**
 * Reducer for graph editor, based on the actions and the current state alters the state
 */
const graphEditorReducer = createReducer(
  initialState,
  on(GraphEditorActions.updateIsLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  })),
  on(GraphEditorActions.selectNode, (state, { id }) => ({
    ...state,
    selectedNode: state.nodes.find((node) => node.id === id) || null,
  })),
  on(GraphEditorActions.deselectNode, (state) => ({
    ...state,
    selectedNode: null,
  })),
  on(GraphEditorActions.addNodeSuccess, (state, { node }) => ({
    ...state,
    nodes: [...state.nodes, node],
  })),
  on(GraphEditorActions.removeNode, (state, { id }) => ({
    ...state,
    nodes: state.nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        neighbours: node.neighbours.filter((neighbour) => neighbour !== id),
      })),
    edges: state.edges.filter((edge) => !(edge.from === id || edge.to === id)),
    isDirty: true,
  })),
  on(GraphEditorActions.updateNode, (state, { node }) => ({
    ...state,
    nodes: state.nodes.map((n) => (n.id === node.id ? { ...n, ...node } : n)),
    isDirty: true,
  })),
  on(GraphEditorActions.updateIsDraft, (state, { isDraft }) => ({
    ...state,
    isDraft,
    isDirty: true,
  })),
  on(GraphEditorActions.updateIsActive, (state, { isActive }) => ({
    ...state,
    isActive,
    isDirty: true,
  })),
  on(GraphEditorActions.updateLastSaved, (state, { lastSaved }) => ({
    ...state,
    lastSaved,
  })),
  on(GraphEditorActions.connectNodesSuccess, (state, { updatedSourceNode, createdEdge }) => ({
    ...state,
    nodes: state.nodes.map((node) => (node.id === updatedSourceNode.id ? updatedSourceNode : node)),
    edges: [...state.edges, createdEdge],
    isDirty: true,
  })),
  on(GraphEditorActions.connectNodesFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(GraphEditorActions.disconnectNodesSuccess, (state, { source, target }) => ({
    ...state,
    nodes: state.nodes.map((node) =>
      node.id === source ? { ...node, neighbours: node.neighbours.filter((neighbour) => neighbour !== target) } : node
    ),
    edges: state.edges.filter((edge) => !(edge.from === source && edge.to === target)),
    isDirty: true,
  })),
  on(GraphEditorActions.disconnectNodesFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphEditorActions.updateNodePosition, (state, { id, position }) => ({
    ...state,
    nodes: state.nodes.map((node) => (node.id === id ? { ...node, position } : node)),
    isDirty: true,
  })),
  on(GraphEditorActions.reset, () => ({
    ...initialState,
  })),
  on(GraphEditorActions.loadGraphSuccess, (state, { graph, edges }) => ({
    ...state,
    graphId: graph.id,
    graphName: graph.name,
    isDraft: graph.isDraft,
    isActive: graph.isActive,
    nodes: graph.nodes,
    schedule: graph.schedule,
    edges: edges,
    isLoading: false,
    isDirty: false,
  })),
  on(GraphEditorActions.loadGraphFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
  })),
  on(GraphEditorActions.saveGraphFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphEditorActions.highlightNode, (state, { id }) => ({
    ...state,
    highlightedNode: id,
  })),
  on(GraphEditorActions.clearHighlighted, (state) => ({
    ...state,
    highlightedNode: null,
  })),
  on(GraphEditorActions.updateName, (state, { name }) => ({
    ...state,
    graphName: name,
    isDirty: true,
  })),
  on(GraphEditorActions.resetError, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphEditorActions.saveGraphSuccess, (state) => ({
    ...state,
    isDirty: false,
  }))
);

/**
 * Reducer for graph editor
 * @param state - current state
 * @param action - action to be performed
 * @returns new state
 */
export function reducer(state: State | undefined, action: Action): State {
  return graphEditorReducer(state, action);
}
