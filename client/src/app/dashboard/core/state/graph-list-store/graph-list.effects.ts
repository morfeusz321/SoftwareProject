import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { ApiGraphListService } from '@app/dashboard/graph-editor/services/graph-list-api-service/graph-list-api-service';
import * as GraphListActions from '@app/dashboard/core/state/graph-list-store/graph-list.actions';

/**
 * Effects to handle the graph list store.
 */
@Injectable()
export class GraphListEffects {
  /**
   * Loads graphs from the API.
   */
  loadGraphs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphListActions.loadGraphs),
      switchMap(() => {
        return this.apiGraphListService.getGraphs().pipe(
          take(1),
          map((graphs) => GraphListActions.loadGraphsSuccess({ graphs })),
          catchError((error) => of(GraphListActions.loadGraphsFailure({ error: error.error.detail ? error.error.detail : error.message })))
        );
      })
    )
  );

  /**
   * Updates a graph.
   */
  updateGraph$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphListActions.updateGraph),
      switchMap(({ graph }) => {
        return this.apiGraphListService.updateGraph(graph).pipe(
          take(1),
          map((responseGraph) => GraphListActions.updateGraphSuccess({ graph: responseGraph })),
          catchError((error) => of(GraphListActions.updateGraphFailure({ error: error.error.detail ? error.error.detail : error.message })))
        );
      })
    )
  );

  /**
   * Deletes a graph.
   */
  deleteGraph$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GraphListActions.deleteGraph),
      switchMap(({ id }) => {
        return this.apiGraphListService.deleteGraph(id).pipe(
          take(1),
          map((responseGraph) => GraphListActions.deleteGraphSuccess({ id })),
          catchError((error) => of(GraphListActions.deleteGraphFailure({ error: error.error.detail ? error.error.detail : error.message })))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private graphListFacade: GraphListFacade,
    private apiGraphListService: ApiGraphListService
  ) {}
}
