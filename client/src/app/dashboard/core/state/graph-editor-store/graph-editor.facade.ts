import { Injectable } from '@angular/core';
import * as GraphEditorReducer from '@app/dashboard/core/state/graph-editor-store/graph-editor.reducer';
import * as GraphEditorActions from '@app/dashboard/core/state/graph-editor-store/graph-editor.actions';
import * as GraphEditorSelectors from '@app/dashboard/core/state/graph-editor-store/graph-editor.selectors';
import { Store } from '@ngrx/store';
import { IActionNode, IConditionNode, IInsocialNode, INode } from '@app/shared/interfaces/node/node.interface';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { NodeConfig } from '@app/shared/configs/node-menu.config';

/**
 * Facade for graph editor
 */
@Injectable({
  providedIn: 'root',
})
export class GraphEditorFacade {
  /**
   * Constructor for the facade
   * @param store - store for the graph editor
   */
  constructor(private store: Store<GraphEditorReducer.State>) {}

  nodes$ = this.store.select(GraphEditorSelectors.selectNodes);
  selectedNode$ = this.store.select(GraphEditorSelectors.selectSelectedNode);
  isDraft$ = this.store.select(GraphEditorSelectors.selectIsDraft);
  isActive$ = this.store.select(GraphEditorSelectors.selectIsActive);
  schedule$ = this.store.select(GraphEditorSelectors.selectSchedule);
  isLoading$ = this.store.select(GraphEditorSelectors.selectIsLoading);
  graph$ = this.store.select(GraphEditorSelectors.selectGraph);
  edges$ = this.store.select(GraphEditorSelectors.selectEdges);
  error$ = this.store.select(GraphEditorSelectors.selectError);
  highlighted$ = this.store.select(GraphEditorSelectors.highlightedNode);
  isDirty$ = this.store.select(GraphEditorSelectors.selectIsDirty);

  /**
   * Function to update graph
   * @param isLoading - is loading
   */
  updateIsLoading(isLoading: boolean): void {
    this.store.dispatch(GraphEditorActions.updateIsLoading({ isLoading }));
  }

  /**
   * Function to add a node
   * @param nodeConfig - node config
   * @param position - node position
   */
  addNode(nodeConfig: NodeConfig, position: ICoordinates): void {
    this.store.dispatch(GraphEditorActions.addNode({ nodeConfig, position }));
  }

  /**
   * Function to remove a node
   * @param id - node id to remove
   */
  removeNode(id: string): void {
    this.store.dispatch(GraphEditorActions.removeNode({ id }));
  }

  /**
   * Function to update a node
   * @param node - node to update
   */
  updateNode(node: INode | IActionNode | IConditionNode | IInsocialNode): void {
    this.store.dispatch(GraphEditorActions.updateNode({ node }));
  }

  /**
   * Function to select node
   * @param id - node id to update
   */
  selectNode(id: string): void {
    this.store.dispatch(GraphEditorActions.selectNode({ id }));
  }

  /**
   * Function to update isDraft
   * @param isDraft - isDraft value
   */
  updateIsDraft(isDraft: boolean): void {
    this.store.dispatch(GraphEditorActions.updateIsDraft({ isDraft }));
  }

  /**
   * Function to update isActive
   * @param isActive - isActive value
   */
  updateIsActive(isActive: boolean): void {
    this.store.dispatch(GraphEditorActions.updateIsActive({ isActive }));
  }

  /**
   * Function to update lastSaved
   * @param lastSaved - lastSaved value
   */
  updateLastSaved(lastSaved: string): void {
    this.store.dispatch(GraphEditorActions.updateLastSaved({ lastSaved }));
  }

  /**
   * Function to reset store
   */
  reset(): void {
    this.store.dispatch(GraphEditorActions.reset());
  }

  /**
   * Function to reset nodes
   */
  resetNodes(): void {
    this.store.dispatch(GraphEditorActions.resetNodes());
  }

  /**
   * Function to deselect node
   */
  deselectNode(): void {
    this.store.dispatch(GraphEditorActions.deselectNode());
  }

  /**
   * Function to connect nodes
   * @param source - source node id
   * @param target - target node id
   */
  connectNodes(source: string, target: string): void {
    this.store.dispatch(GraphEditorActions.connectNodes({ source, target }));
  }

  /**
   * Function to disconnect nodes
   * @param source - source node id
   * @param target - target node id
   */
  disconnectNodes(source: string, target: string): void {
    this.store.dispatch(GraphEditorActions.disconnectNodes({ source, target }));
  }

  /**
   * Function to save graph
   */
  saveGraph(): void {
    this.store.dispatch(GraphEditorActions.saveGraph());
  }

  /**
   * Function to update nodes position
   * @param id - node id
   * @param position - new node position
   */
  updateNodePosition(id: string, position: ICoordinates): void {
    this.store.dispatch(GraphEditorActions.updateNodePosition({ id, position }));
  }

  /**
   * Function to load graph
   * @param graphId - graph id
   */
  loadGraph(graphId: number): void {
    this.store.dispatch(GraphEditorActions.loadGraph({ graphId }));
  }

  /**
   * Function to highlight node
   * @param id - node id
   */
  highlightNode(id: string): void {
    this.store.dispatch(GraphEditorActions.highlightNode({ id }));
  }

  /**
   * Function to clear highlighted node
   */
  clearHighlighted(): void {
    this.store.dispatch(GraphEditorActions.clearHighlighted());
  }

  /**
   * Function to update graph name
   * @param name - new graph name
   */
  updateName(name: string): void {
    this.store.dispatch(GraphEditorActions.updateName({ name }));
  }

  /**
   * Function to reset an error wit new value
   * @param error - new error value
   */
  resetError(error: any): void {
    this.store.dispatch(GraphEditorActions.resetError({ error }));
  }
}
