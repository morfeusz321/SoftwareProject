import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { Observable } from 'rxjs';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';

/**
 * Service to handle the api calls for the graph list
 */
@Injectable({
  providedIn: 'root',
})
export class ApiGraphListService {
  readonly id: number = environment.userId;
  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   * @param apiService - The api service
   */
  constructor(private apiService: ApiService) {}

  /**
   * Function to create a graph
   * @param graph - the graph to create
   * @returns the created graph
   */
  createGraph(graph: IGraph): Observable<IGraph> {
    return this.apiService.post(`${this.apiUrl}/api/user/${this.id}/graphs`, graph);
  }

  /**
   * Function to get the graphs
   * @returns the graphs
   */
  getGraphs(): Observable<IGraph[]> {
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/graphs`);
  }

  /**
   * Function to update the graph
   * @param graph - the graph to update
   * @returns the updated graph
   */
  updateGraph(graph: IGraph): Observable<IGraph> {
    return this.apiService.put(`${this.apiUrl}/api/user/${this.id}/graphs/${graph.id}`, graph);
  }

  /**
   * Function to delete the graph
   * @param id - the graph id to delete
   * @returns the deleted graph
   */
  deleteGraph(id: number): Observable<IGraph> {
    return this.apiService.delete(`${this.apiUrl}/api/user/${this.id}/graphs/${id}`);
  }
}
