import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request', () => {
    const testData = { id: 1, name: 'Test' };
    service.get(`${environment.apiUrl}/test`).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should make a POST request', () => {
    const testData = { id: 1, name: 'Test' };
    service.post(`${environment.apiUrl}/test`, testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(testData));
    req.flush(testData);
  });

  it('should make a PUT request', () => {
    const testData = { id: 1, name: 'Test' };
    service.put(`${environment.apiUrl}/test`, testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(JSON.stringify(testData));
    req.flush(testData);
  });

  it('should make a DELETE request', () => {
    const testData = { id: 1, name: 'Test' };
    service.delete(`${environment.apiUrl}/test`, testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(JSON.stringify(testData));
    req.flush(testData);
  });
});
