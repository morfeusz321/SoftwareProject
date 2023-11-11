import { initialState, reducer, State } from '@app/dashboard/core/state/graph-list-store/graph-list.reducer';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

const graph: IGraph = {
  id: 1,
  name: 'graph',
  nodes: [],
  isDraft: true,
  isActive: true,
  schedule: '1*111',
};

const initialTestState: State = {
  graphs: [],
  error: '',
};

describe('GraphListReducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const result = reducer(undefined, action);
      expect(result).toEqual(initialState);
      expect(result).toEqual(initialTestState);
    });
  });

  describe('loadGraphSuccess action', () => {
    it('should load the graphs', () => {
      const graphArr: IGraph[] = [graph];
      const action = GraphListActions.loadGraphsSuccess({
        graphs: graphArr,
      });
      const result = reducer(initialState, action);
      expect(result.graphs).toEqual(graphArr);
    });
  });

  describe('loadGraphFailure action', () => {
    it('should update the error', () => {
      const error = 'error';
      const action = GraphListActions.loadGraphsFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('updateGraphSuccess action', () => {
    it('should load the graphs', () => {
      const action = GraphListActions.updateGraphSuccess({ graph });
      const state: State = {
        ...initialState,
        graphs: [graph],
      };
      const result = reducer(state, action);
      expect(result.graphs.find((g) => g.id === graph.id)).toEqual(graph);
    });
  });

  describe('updateGraphFailure action', () => {
    it('should update the error', () => {
      const error = 'error';
      const action = GraphListActions.updateGraphFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('deleteGraphSuccess action', () => {
    it('should delete the graph', () => {
      const action = GraphListActions.deleteGraphSuccess({ id: graph.id });
      const state: State = {
        ...initialState,
        graphs: [graph],
      };
      const result = reducer(state, action);
      expect(result.graphs.find((g) => g.id === graph.id)).toEqual(undefined);
    });
  });

  describe('deleteGraphFailure action', () => {
    it('should delete the graph', () => {
      const error = 'error';
      const action = GraphListActions.deleteGraphFailure({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });

  describe('resetError action', () => {
    it('should reset the error', () => {
      const error = 'error';
      const action = GraphListActions.resetError({ error });
      const result = reducer(initialState, action);
      expect(result.error).toEqual(error);
    });
  });
});
