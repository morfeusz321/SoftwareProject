import { environment } from '@env/environment';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { Injectable } from '@angular/core';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { Observable } from 'rxjs';

/**
 * Service to handle the api calls for the graph execution
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGraphExecutionService {
  readonly id: number = environment.userId;
  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   * @param apiService - The api service
   */
  constructor(private apiService: ApiService) {}

  /**
   * Get the list of graphs
   * @param graphId - The graph id
   * @param executingInSandbox - Whether the graph is executed in sandbox
   * @returns if the graph was executed
   */
  executeGraph(graphId: number, executingInSandbox: boolean = false): Observable<any> {
    const endpoint = executingInSandbox ? 'executeSandbox' : 'execute';
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/graphs/${graphId}/${endpoint}`);
  }

  /**
   * Get the execution log for a graph
   * @param graphId - The graph id
   * @returns the execution log
   */
  getExecutionLog(graphId: number): Observable<any> {
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/graphs/${graphId}/logs`);
  }

  /**
   * Execute a node
   * @param node - The node to execute
   * @returns if the node was executed
   */
  executeNode(node: INode): Observable<any> {
    return this.apiService.post(`${this.apiUrl}/api/user/${this.id}/nodes/execute`, node);
  }
}
