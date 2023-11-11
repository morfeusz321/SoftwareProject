import * as fromGraphList from './graph-list.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectGraphListState = createFeatureSelector<fromGraphList.State>(fromGraphList.graphListFeatureKey);

export const selectGraph = createSelector(selectGraphListState, (state) => state);

export const selectGraphs = createSelector(selectGraphListState, (state) => state.graphs);

export const selectError = createSelector(selectGraphListState, (state) => state.error);
