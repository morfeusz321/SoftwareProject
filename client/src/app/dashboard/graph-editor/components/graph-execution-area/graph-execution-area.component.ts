import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { GraphExecutionLogsComponent } from '@app/dashboard/graph-execution/components/graph-execution-logs/graph-execution-logs.component';

/**
 * Component handling execution of graph in the builder
 */
@Component({
  selector: 'app-graph-execution-area',
  templateUrl: './graph-execution-area.component.html',
  styleUrls: ['./graph-execution-area.component.scss'],
})
export class GraphExecutionAreaComponent {
  @Input()
  expanded: boolean;
  @Input()
  selectedGraph: IGraph;

  @Output() expandedChanged = new EventEmitter<boolean>();

  @ViewChild(GraphExecutionLogsComponent) graphExecutionLogs: GraphExecutionLogsComponent;

  /**
   * Emits event when the expansion button is clicked
   */
  expansionClicked(): void {
    this.expandedChanged.emit(this.expanded);
  }

  /**
   * Executes the graph
   * @param $event - event object
   */
  executeGraph($event: any): void {
    $event.stopPropagation();
    if (!this.expanded) {
      this.expanded = true;
      this.expansionClicked();
    }
    this.graphExecutionLogs.executeGraph();
  }

  /**
   * Clears the logs
   * @param $event - event object
   */
  clearLogs($event: any): void {
    $event.stopPropagation();
    this.graphExecutionLogs.clearLogs();
  }
}
