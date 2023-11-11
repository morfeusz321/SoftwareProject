import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGraphEditor from './graph-editor.reducer';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

export const selectGraphEditorState = createFeatureSelector<fromGraphEditor.State>(
  fromGraphEditor.graphEditorFeatureKey
);

export const selectIsLoading = createSelector(selectGraphEditorState, (state) => state.isLoading);
export const selectNodes = createSelector(selectGraphEditorState, (state) => state.nodes);
export const selectSelectedNode = createSelector(selectGraphEditorState, (state) => state.selectedNode);
export const selectIsDraft = createSelector(selectGraphEditorState, (state) => state.isDraft);
export const selectIsActive = createSelector(selectGraphEditorState, (state) => state.isActive);
export const selectSchedule = createSelector(selectGraphEditorState, (state) => state.schedule);
export const selectEdges = createSelector(selectGraphEditorState, (state) => state.edges);
export const selectGraph = createSelector(selectGraphEditorState, (state) => {
  return {
    id: state.graphId,
    name: state.graphName,
    nodes: state.nodes,
    isActive: state.isActive,
    isDraft: state.isDraft,
    schedule: state.schedule,
  } as IGraph;
});
export const selectError = createSelector(selectGraphEditorState, (state) => state.error);
export const highlightedNode = createSelector(selectGraphEditorState, (state) => state.highlightedNode);
export const selectIsDirty = createSelector(selectGraphEditorState, (state) => state.isDirty);
