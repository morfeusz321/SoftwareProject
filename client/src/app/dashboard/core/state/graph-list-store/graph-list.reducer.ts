import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { Action, createReducer, on } from '@ngrx/store';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';

export const graphListFeatureKey = 'graph-list';

export interface State {
  graphs: IGraph[];
  error: any;
}

export const initialState: State = {
  graphs: [],
  error: '',
};

/**
 * Graph list reducer that handles actions and updates state
 */
const graphListReducer = createReducer(
  initialState,
  on(GraphListActions.updateGraphSuccess, (state, { graph }) => ({
    ...state,
    graphs: state.graphs.map((g) => (g.id === graph.id ? graph : g)),
  })),
  on(GraphListActions.updateGraphFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphListActions.loadGraphsSuccess, (state, { graphs }) => ({
    ...state,
    graphs: graphs,
  })),
  on(GraphListActions.loadGraphsFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphListActions.deleteGraphSuccess, (state, { id }) => ({
    ...state,
    graphs: state.graphs.filter((g) => g.id !== id),
  })),
  on(GraphListActions.deleteGraphFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(GraphListActions.resetError, (state, { error }) => ({
    ...state,
    error: error,
  }))
);

/**
 * Reducer function
 * @param state - current state
 * @param action - action to perform
 * @returns new state
 */
export function reducer(state: State | undefined, action: Action): State {
  return graphListReducer(state, action);
}
