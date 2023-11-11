import { NgModule } from '@angular/core';
import { ToolbarModule } from '@app/dashboard/toolbar/toolbar.module';
import { GraphEditorModule } from '@app/dashboard/graph-editor/graph-editor.module';
import { NodeEditorModule } from '@app/dashboard/node-editor/node-editor.module';
import {GraphOverviewModule} from "@app/dashboard/graph-overview/graph-overview.module";
import {GraphExecutionModule} from "@app/dashboard/graph-execution/components/graph-execution-module";

@NgModule({
  declarations: [],
  imports: [ToolbarModule],
  exports: [ToolbarModule, GraphEditorModule, NodeEditorModule, GraphOverviewModule, GraphExecutionModule],
  providers: [],
  bootstrap: [],
})
export class DashboardModule {}
