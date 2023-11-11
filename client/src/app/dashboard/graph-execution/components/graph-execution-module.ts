import { NgModule } from '@angular/core';
import { GraphExecutionComponent } from '@app/dashboard/graph-execution/components/graph-execution/graph-execution.component';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { GraphExecutionLogsComponent } from '@app/dashboard/graph-execution/components/graph-execution-logs/graph-execution-logs.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@NgModule({
  declarations: [GraphExecutionLogsComponent, GraphExecutionComponent],
  imports: [
    MatSelectModule,
    NgForOf,
    AsyncPipe,
    MatButtonModule,
    FormsModule,
    NgIf,
    MatCardModule,
    TranslocoModule,
    NgClass,
    MatExpansionModule,
    MatSlideToggleModule,
  ],
  providers: [GraphExecutionLogsComponent, GraphExecutionComponent],
  exports: [GraphExecutionComponent, GraphExecutionLogsComponent],
  bootstrap: [],
})
export class GraphExecutionModule {}
