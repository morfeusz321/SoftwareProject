import { NgModule } from '@angular/core';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { BasicNodeComponent } from '@app/dashboard/graph-editor/components/basic-node/basic-node.component';
import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { GraphAreaComponent } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { GraphBuilderComponent } from '@app/dashboard/graph-editor/components/graph-builder/graph-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { ButtonColumnComponent } from '@app/dashboard/graph-editor/components/button-column/button-column.component';
import { AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, SlicePipe, TitleCasePipe } from '@angular/common';
import { MenuNodeComponent } from './components/menu-node/menu-node.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NewGraphInputComponent } from '@app/dashboard/graph-editor/components/new-graph-input/new-graph-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CustomMenuNodeComponent } from '@app/dashboard/graph-editor/components/custom-menu-node/custom-menu-node.component';
import { SharedModule } from '@app/shared/shared.module';
import { MatListModule } from '@angular/material/list';
import { GraphExecutionAreaComponent } from '@app/dashboard/graph-editor/components/graph-execution-area/graph-execution-area.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GraphExecutionModule } from '@app/dashboard/graph-execution/components/graph-execution-module';
import { HttpResponseDialogComponent } from '@app/dashboard/node-editor/components/http-response-dialog/http-response-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    BasicNodeComponent,
    GraphAreaComponent,
    GraphBuilderComponent,
    ButtonColumnComponent,
    MenuNodeComponent,
    NewGraphInputComponent,
    GraphExecutionAreaComponent,
    NewGraphInputComponent,
    CustomMenuNodeComponent,
    HttpResponseDialogComponent,
  ],
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkDrag,
    CdkDropList,
    CdkDragHandle,
    ScrollingModule,
    KeyValuePipe,
    NgForOf,
    AsyncPipe,
    MatButtonModule,
    NgClass,
    TitleCasePipe,
    MatTooltipModule,
    NgIf,
    SlicePipe,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    TranslocoModule,
    CdkMenu,
    CdkMenuTrigger,
    CdkMenuItem,
    SharedModule,
    MatListModule,
    MatSlideToggleModule,
    GraphExecutionModule,
    MatExpansionModule,
    MatDialogModule,
  ],
  providers: [BasicNodeComponent],
  exports: [GraphBuilderComponent, NewGraphInputComponent],
  bootstrap: [],
})
export class GraphEditorModule {}
