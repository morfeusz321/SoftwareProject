import * as fromReducer from '@app/dashboard/core/state/graph-list-store/graph-list.reducer';
import { GraphListEffects } from '@app/dashboard/core/state/graph-list-store/graph-list.effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromReducer.graphListFeatureKey, fromReducer.reducer),
    EffectsModule.forFeature([GraphListEffects]),
  ],
  providers: [],
})
export class GraphListStoreModule {}
