import { createAction, props } from '@ngrx/store';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { NodeConfig } from '@app/shared/configs/node-menu.config';
import { Edge } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

/**
 * Actions for graph editor
 */

/**
 * Action to connect two nodes
 */
export const connectNodes = createAction('[Graph Editor] Connect Nodes', props<{ source: string; target: string }>());

/**
 * Action to disconnect two nodes
 */
export const disconnectNodes = createAction(
  '[Graph Editor] Disconnect Nodes',
  props<{ source: string; target: string }>()
);

/**
 * Action to select node
 */
export const selectNode = createAction('[Graph Editor] Select Node', props<{ id: string }>());

/**
 * Action to deselect node
 */
export const deselectNode = createAction('[Graph Editor] Deselect Node');

/**
 * Action to add node
 */
export const addNode = createAction(
  '[Graph Editor] Add Node',
  props<{ nodeConfig: NodeConfig; position: ICoordinates }>()
);

/**
 * Action to remove node
 */
export const removeNode = createAction('[Graph Editor] Remove Node', props<{ id: string }>());

/**
 * Action to update node
 */
export const updateNode = createAction('[Graph Editor] Update Node', props<{ node: Partial<INode> }>());

/**
 * Action to update nodes
 */
export const updateNodes = createAction('[Graph Editor] Update Nodes', props<{ nodes: Partial<INode>[] }>());

/**
 * Action to update node position
 */
export const updateNodePosition = createAction(
  '[Graph Editor] Update Node Position',
  props<{ id: string; position: ICoordinates }>()
);

/**
 * Action to update last saved date
 */
export const updateLastSaved = createAction('[Graph Editor] Update Last Saved', props<{ lastSaved: string }>());
/**
 * Action to update isDraft
 */
export const updateIsDraft = createAction('[Graph Editor] Update Is Draft', props<{ isDraft: boolean }>());

/**
 * Action to update isSaved
 */
export const updateIsActive = createAction('[Graph Editor] Update Is Active', props<{ isActive: boolean }>());
/**
 * Action to update isLoading
 */
export const updateIsLoading = createAction('[Graph Editor] Update Is Loading', props<{ isLoading: boolean }>());
/**
 * Action to update Nodes List
 */
export const updateNodesList = createAction('[Graph Editor] Update Nodes List', props<{ nodes: INode[] }>());
/**
 * Action to indicate that nodes list was updated successfully
 */
export const updateNodesListSuccess = createAction(
  '[Graph Editor] Update Nodes List Success',
  props<{ nodes: INode[] }>()
);

/**
 * Action to indicate that nodes list was updated unsuccessfully
 */
export const updateNodesListFailure = createAction('[Graph Editor] Update Nodes List Failure', props<{ error: any }>());
/**
 * Action to indicate that node was added unsuccessfully
 */
export const addNodeSuccess = createAction('[Graph Editor] Add Node Success', props<{ node: INode }>());

/**
 * Action to indicate that node was added unsuccessfully
 */
export const addNodeFailure = createAction('[Graph Editor] Add Node Failure', props<{ error: any }>());

/**
 * Action to indicate that nodes were connected successfully
 */
export const connectNodesSuccess = createAction(
  '[Graph Editor] Connect Nodes Success',
  props<{ updatedSourceNode: INode; createdEdge: Edge }>()
);

/**
 * Action to indicate that nodes were connected unsuccessfully
 */
export const connectNodesFailure = createAction('[Graph Editor] Connect Nodes Failure', props<{ error: any }>());

/**
 * Action to indicate that nodes were disconnected successfully
 */
export const disconnectNodesSuccess = createAction(
  '[Graph Editor] Disconnect Nodes Success',
  props<{ source: string; target: string }>()
);

/**
 * Action to indicate that nodes were disconnected unsuccessfully
 */
export const disconnectNodesFailure = createAction('[Graph Editor] Disconnect Nodes Failure', props<{ error: any }>());

/**
 * Action to save the graph in the database
 */
export const saveGraph = createAction('[Graph Editor] Save Graph');

/**
 * Action to indicate that graph was saved successfully
 */
export const saveGraphSuccess = createAction('[Graph Editor] Save Graph Success');

/**
 * Action to indicate that graph was saved unsuccessfully
 */
export const saveGraphFailure = createAction('[Graph Editor] Save Graph Failure', props<{ error: any }>());

/**
 * Action to reset the store
 */
export const reset = createAction('[Graph Editor] Reset');

/**
 * Action to reset the nodes
 */
export const resetNodes = createAction('[Graph Editor] Reset Nodes');

/**
 * Action to load the graph into the store
 */
export const loadGraph = createAction('[Graph Editor] Load Graph', props<{ graphId: number }>());

/**
 * Action to indicate that graph was loaded successfully
 */
export const loadGraphSuccess = createAction(
  '[Graph Editor] Load Graph Success',
  props<{
    graph: IGraph;
    edges: Edge[];
  }>()
);

/**
 * Action to indicate that graph was loaded unsuccessfully
 */
export const loadGraphFailure = createAction('[Graph Editor] Load Graph Failure', props<{ error: any }>());

/**
 * Action to highlight node
 */
export const highlightNode = createAction('[Graph Editor] Highlight Node', props<{ id: string }>());

/**
 * Action to clear highlighted node
 */
export const clearHighlighted = createAction('[Graph Editor] Clear Highlighted');

/**
 * Action to update graph name
 */
export const updateName = createAction('[Graph Editor] Update Name', props<{ name: string }>());
/**
 * Action to reset store errors
 */
export const resetError = createAction('[Graph Editor] Reset Error', props<{ error: any }>());
