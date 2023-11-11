import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConfigEnum } from '@app/shared/enums/routing.enum';
import { GraphBuilderComponent } from '@app/dashboard/graph-editor/components/graph-builder/graph-builder.component';
import { NodeEditMenuComponent } from '@app/dashboard/node-editor/components/node-edit-menu/node-edit-menu.component';
import { GraphExecutionComponent } from '@app/dashboard/graph-execution/components/graph-execution/graph-execution.component';
import { GraphOverviewComponent } from '@app/dashboard/graph-overview/graph-overview/graph-overview.component';

// TODO: Change AppComponent to the appropriate components when they are created.
const routes: Routes = [
  { path: '', redirectTo: RouteConfigEnum.BUILDER, pathMatch: 'full' },
  { path: RouteConfigEnum.HOME, component: GraphBuilderComponent },
  {
    path: RouteConfigEnum.BUILDER,
    component: NodeEditMenuComponent,
    canDeactivate: [(component: NodeEditMenuComponent) => {
      if(component.isDirty)
        return confirm("You have unsaved changes made to the flow. Leaving without saving will discard them.");
      else
        return true;
    }]
  },
  { path: RouteConfigEnum.OVERVIEW, component: GraphOverviewComponent },
  { path: RouteConfigEnum.EXECUTION, component: GraphExecutionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
