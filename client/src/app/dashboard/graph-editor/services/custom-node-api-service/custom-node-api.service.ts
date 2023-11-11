import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@app/shared/services/api-service/api.service';
import { Observable } from 'rxjs';
import { ICustomNode } from '@app/shared/interfaces/node/node.interface';

/**
 * Service to handle the custom node api calls
 */
@Injectable({
  providedIn: 'root',
})
export class ApiCustomNodeService {
  readonly id: number = environment.userId;
  readonly graphId: number = environment.graphId;
  readonly apiUrl: string = environment.apiUrl;

  /**
   * Constructor
   * @param apiService - The api service
   */
  constructor(private apiService: ApiService) {}

  /**
   * Function to save the custom node
   * @param node - the node to save
   * @returns the saved node
   */
  saveCustomNode(node: ICustomNode): Observable<ICustomNode> {
    return this.apiService.post(`${this.apiUrl}/api/user/${this.id}/custom-nodes`, node);
  }

  /**
   * Function to update the custom node
   * @param node - the node to save
   * @returns the saved node
   */
  updateCustomNode(node: ICustomNode): Observable<ICustomNode> {
    return this.apiService.put(`${this.apiUrl}/api/user/${this.id}/custom-nodes/${node.id}`, node);
  }

  /**
   * Function to get the custom node
   * @param nodeId - the node id to get
   * @returns the node
   */
  getNode(nodeId: number): Observable<ICustomNode> {
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/custom-nodes/${nodeId}`);
  }

  /**
   * Function to delete the custom node
   * @param nodeId - the node id to delete
   * @returns the deleted node
   */
  deleteNode(nodeId: number): Observable<ICustomNode> {
    return this.apiService.delete(`${this.apiUrl}/api/user/${this.id}/custom-nodes/${nodeId}`);
  }

  /**
   * Function to get all the custom nodes
   * @returns the custom nodes
   */
  getNodes(): Observable<ICustomNode[]> {
    return this.apiService.get(`${this.apiUrl}/api/user/${this.id}/custom-nodes`);
  }
}
