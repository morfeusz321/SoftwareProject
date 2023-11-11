import { ApiGraphEditorService } from "@app/dashboard/graph-editor/services/graph-editor-api-service/graph-editor-api-service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {IGraph} from "@app/shared/interfaces/graph/graph.interface";
import {ApiService} from "@app/shared/services/api-service/api.service";
import {environment} from "@env/environment";
import {
  ApiGraphExecutionService
} from "@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service";

describe('ApiService', () => {
  let service: ApiGraphExecutionService
  let mainService: ApiService;
  let httpMock: HttpTestingController;

  let graphId: number = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiGraphEditorService, ApiService],
    });
    service = TestBed.inject(ApiGraphExecutionService);
    mainService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request for graph execution', () => {
    const testData = graphId;
    service.executeGraph(graphId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock
      .expectOne(`${environment.apiUrl}/api/user/${environment.userId}/graphs/${environment.graphId}/execute`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should make a get request for getting logs', () => {
    const testData = graphId;
    service.getExecutionLog(graphId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock
      .expectOne(`${environment.apiUrl}/api/user/${environment.userId}/graphs/${environment.graphId}/logs`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

});
