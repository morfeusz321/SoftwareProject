import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromEditorReducer from '@app/dashboard/core/state/graph-editor-store/graph-editor.reducer';
import * as fromListReducer from '@app/dashboard/core/state/graph-list-store/graph-list.reducer';

export interface State {
  [fromEditorReducer.graphEditorFeatureKey]: fromEditorReducer.State;
  [fromListReducer.graphListFeatureKey]: fromListReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromEditorReducer.graphEditorFeatureKey]: fromEditorReducer.reducer,
  [fromListReducer.graphListFeatureKey]: fromListReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
