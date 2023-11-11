import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import * as fromReducer from '@app/dashboard/core/state/graph-editor-store/graph-editor.reducer';
import { GraphEditorEffects } from '@app/dashboard/core/state/graph-editor-store/graph-editor.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromReducer.graphEditorFeatureKey, fromReducer.reducer),
    EffectsModule.forFeature([GraphEditorEffects]),
  ],
  providers: [],
})
export class GraphEditorStoreModule {}
