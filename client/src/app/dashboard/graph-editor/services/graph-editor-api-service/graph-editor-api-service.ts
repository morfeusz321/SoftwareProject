import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { Observable } from 'rxjs';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

/**
 * Service to handle the api calls for the graph editor
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGraphEditorService {
  readonly id: number = environment.userId;
  readonly graphId: number = environment.graphId;
  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   * @param apiService - The api service
   */
  constructor(private apiService: ApiService) {}

  /**
   * Function to save the graph in the database
   * @param graph - the graph to save
   * @returns the saved graph
   */
  saveGraph(graph: IGraph): Observable<IGraph> {
    return this.apiService.put(`${this.apiUrl}/api/user/${this.id}/graphs/${graph.id}`, graph);
  }

  /**
   * Function to get the graph
   * @param graphId - the graph id to retrieve
   * @returns the graph
   */
  getGraph(graphId: number): Observable<IGraph> {
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/graphs/${graphId}`);
  }
}
