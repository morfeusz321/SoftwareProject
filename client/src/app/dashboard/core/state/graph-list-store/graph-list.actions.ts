import { createAction, props } from '@ngrx/store';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

/**
 * Action to load all graphs for a user
 */
export const loadGraphs = createAction('[Graph List] Send Get Request For Graphs');

/**
 * Action to indicate that the graphs were loaded successfully
 */
export const loadGraphsSuccess = createAction('[Graph List] Load Graph Succeeded', props<{ graphs: IGraph[] }>());

/**
 * Action to indicate that the graphs could not be loaded
 */
export const loadGraphsFailure = createAction('[Graph List] Load Graph Failed', props<{ error: any }>());

/**
 * Action to update a graph
 */
export const updateGraph = createAction('[Graph List] Update Graph', props<{ graph: IGraph }>());

/**
 * Action to indicate that the graph was updated successfully
 */
export const updateGraphSuccess = createAction('[Graph List] Update Graph Succeeded', props<{ graph: IGraph }>());

/**
 * Action to indicate that the graph could not be updated
 */
export const updateGraphFailure = createAction('[Graph List] Update Graph Failed', props<{ error: any }>());

/**
 * Action to delete a graph
 */
export const deleteGraph = createAction('[Graph List] Delete Graph', props<{ id: number }>());

/**
 * Action to indicate that the graph was deleted successfully
 */
export const deleteGraphSuccess = createAction('[Graph List] Delete Graph Success', props<{ id: number }>());

/**
 * Action to indicate that the graph could not be deleted
 */
export const deleteGraphFailure = createAction('[Graph List] Delete Graph Failure', props<{ error: string }>());

/**
 * Action to reset the error
 */
export const resetError = createAction('[Graph List] Reset Error', props<{ error: any }>());
