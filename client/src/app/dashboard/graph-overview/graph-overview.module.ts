import { NgModule } from '@angular/core';
import { GraphOverviewComponent } from '@app/dashboard/graph-overview/graph-overview/graph-overview.component';
import { GraphOverviewGraphComponent } from '@app/dashboard/graph-overview/graph-overview-graph/graph-overview-graph.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { DialogueWindowComponent } from '@app/dashboard/graph-overview/dialogue-window/dialogue-window-component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [GraphOverviewComponent, GraphOverviewGraphComponent, DialogueWindowComponent],
  imports: [
    NgForOf,
    MatButtonModule,
    AsyncPipe,
    TranslocoModule,
    MatDialogModule,
    NgIf,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  exports: [GraphOverviewComponent],
})
export class GraphOverviewModule {}
