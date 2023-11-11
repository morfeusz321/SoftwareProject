import { NgModule } from '@angular/core';
import { GraphEditorStoreModule } from '@app/dashboard/core/state/graph-editor-store/graph-editor-store.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { GraphListStoreModule } from '@app/dashboard/core/state/graph-list-store/graph-list-store.module';

@NgModule({
  imports: [
    GraphEditorStoreModule,
    GraphListStoreModule,
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
})
export class CoreModule {}
