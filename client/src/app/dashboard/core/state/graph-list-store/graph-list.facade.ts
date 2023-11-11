import { Injectable } from '@angular/core';
import * as GraphListReducer from '@app/dashboard/core/state/graph-list-store/graph-list.reducer';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';
import * as GraphListSelectors from '@app/dashboard/core/state/graph-list-store/graph-list.selectors';
import { Store } from '@ngrx/store';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

/**
 * Facade for graph list store
 */
@Injectable({
  providedIn: 'root',
})
export class GraphListFacade {
  /**
   * Constructor
   * @param store - graph list store
   */
  constructor(private store: Store<GraphListReducer.State>) {}

  graphs$ = this.store.select(GraphListSelectors.selectGraphs);
  error$ = this.store.select(GraphListSelectors.selectError);

  /**
   * Load graphs
   */
  loadGraphs(): void {
    this.store.dispatch(GraphListActions.loadGraphs());
  }

  /**
   * Updates graph
   * @param graph - new graph
   */
  updateGraph(graph: IGraph): void {
    this.store.dispatch(GraphListActions.updateGraph({ graph }));
  }

  /**
   * Deletes graph
   * @param id - graph id
   */
  deleteGraph(id: number) {
    this.store.dispatch(GraphListActions.deleteGraph({ id }));
  }

  /**
   * Resets error with a new value
   * @param error - error value
   */
  resetError(error: any): void {
    this.store.dispatch(GraphListActions.resetError({ error }));
  }
}
