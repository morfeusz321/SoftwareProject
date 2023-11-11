import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { ApiGraphExecutionService } from '@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service';
import { Observable, take } from 'rxjs';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

interface ILogs {
  nodeId: string;
  nodeInfo: string;
  evaluatedTo: string[];
}

interface IExecution {
  graphName: string;
  logs: ILogs[];
  error?: string;
}

/**
 * Component to display the graph execution logs
 */
@Component({
  selector: 'app-graph-execution-logs',
  templateUrl: './graph-execution-logs.component.html',
  styleUrls: ['./graph-execution-logs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphExecutionLogsComponent implements OnInit {
  @Input()
  selectedGraph: IGraph;
  @Input()
  graphListVisible: boolean;

  logArray: ILogs[] = [];

  executionArray: IExecution[] = [];
  executingInSandbox: boolean;

  executionLog: string = 'Execution log will be displayed here.';
  graphs$: Observable<IGraph[]> = this.graphListFacade.graphs$;
  length: number;

  /**
   * Constructor
   * @param graphListFacade - facade for the graph list store
   * @param executionService - service to execute the graph
   * @param cdRef - change detector reference
   */
  constructor(
    private graphListFacade: GraphListFacade,
    private executionService: ApiGraphExecutionService,
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * Initializes the component with correct data
   */
  ngOnInit(): void {
    if (this.graphListVisible) {
      this.graphListFacade.loadGraphs();
      this.graphs$.subscribe((graphs) => {
        this.length = graphs.length;
      });
      this.executingInSandbox = true;
    }
  }

  /**
   * Executes the selected graph
   */
  executeGraph(): void {
    this.executionArray.push({ graphName: this.selectedGraph.name, logs: [] });
    this.executionService.executeGraph(this.selectedGraph.id, this.executingInSandbox).subscribe(
      () => {
        this.getExecutionLog(this.selectedGraph.id);
      },
      (error) => {
        this.executionArray[
          this.executionArray.length - 1
        ].error = `While executing encountered an error with status: ${error.status}.\n${error.error.detail ? error.error.detail : error.message}`;
        this.getExecutionLog(this.selectedGraph.id);
      }
    );
    this.cdRef.detectChanges();
  }

  /**
   * Parses the logs returned from the backend in to an array of objects to display in the UI
   * @param logs - logs returned from the backend
   */
  parseArray(logs: string[]): void {
    let i = 0;
    const regex = /Step result evaluated to: (.+)$/i;
    const nodeExecutionRegex = /(Executing .*(Trigger|Condition|Action|Invite)).*/;

    while (i < logs.length) {
      const match = logs[i].match(nodeExecutionRegex);
      if (match) {
        let nodeInfo = match[1];
        nodeInfo = nodeInfo.replace('Trigger', 'Start');
        const nodeId = logs[i + 1];
        let evaluatedTo: string[] = [];
        i += 2;
        while (i < logs.length && !nodeExecutionRegex.test(logs[i])) {
          const match = logs[i].match(regex);
          if (match && match[1]) {
            const evaluated = match[1];
            evaluatedTo.push(logs[i].replace(evaluated, '')); // remove evaluated part from string
            const obj = JSON.parse(evaluated);
            evaluatedTo.push(JSON.stringify(obj, null, 2));
          } else {
            evaluatedTo.push(logs[i]);
          }
          i++;
        }
        this.executionArray[this.executionArray.length - 1].logs.push({ nodeId, nodeInfo, evaluatedTo });
      } else {
        i++;
      }
    }
    this.cdRef.detectChanges();
  }

  /**
   * Gets the execution logs for the selected graph
   * @param graphId - id of the selected graph
   */
  getExecutionLog(graphId: number): void {
    this.executionService
      .getExecutionLog(graphId)
      .pipe(take(1))
      .subscribe(
        (logs) => {
          const logArray = logs as { logs: string[] };
          this.parseArray(logArray.logs);
        },
        (error) => {
          this.executionArray[
            this.executionArray.length - 1
          ].error = `While fetching logs encountered an error with status: ${error.status}.\n${error.error.detail ? error.error.detail : error.message}`;
        }
      );
    this.cdRef.detectChanges();
  }

  /**
   * Clears the logs
   */
  clearLogs(): void {
    this.executionArray = [];
    this.cdRef.detectChanges();
  }
}
