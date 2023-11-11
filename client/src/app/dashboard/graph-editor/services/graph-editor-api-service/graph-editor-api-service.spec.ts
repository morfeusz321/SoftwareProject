import { ApiGraphEditorService } from "@app/dashboard/graph-editor/services/graph-editor-api-service/graph-editor-api-service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {IGraph} from "@app/shared/interfaces/graph/graph.interface";
import {ApiService} from "@app/shared/services/api-service/api.service";
import {environment} from "@env/environment";

describe('ApiService', () => {
  let service: ApiGraphEditorService
  let mainService: ApiService;
  let httpMock: HttpTestingController;

  let graph: IGraph = {
    id: 1,
    name: 'Test',
    isDraft: true,
    isActive: false,
    schedule: '0 0 0 * * *',
    nodes: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiGraphEditorService, ApiService],
    });
    service = TestBed.inject(ApiGraphEditorService);
    mainService = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a PUT request for saving graph', () => {
    const testData = graph;
    service.saveGraph(graph).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock
      .expectOne(`${environment.apiUrl}/api/user/${environment.userId}/graphs/${environment.graphId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(testData);
  });

});
