import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Generic service to make http requests
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Function to make a get request
   * @param url - url to make the request
   * @param params - params to send
   * @param headers - headers to send
   */
  get<T>(url: string, params?: HttpParams | Record<string, any>, headers?: Record<string, any>): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.headers(headers),
      params,
    });
  }

  /**
   * Function to send post request
   * @param url - url to make the request
   * @param data - data to send
   */
  post<T>(url: string, data: object = {}): Observable<T> {
    return this.http.post<T>(url, JSON.stringify(data), {
      headers: this.headers(),
    });
  }

  /**
   * Function to send put request
   * @param url - url to make the request
   * @param data - data to send
   */
  put<T>(url: string, data: object = {}): Observable<T> {
    return this.http.put<T>(url, JSON.stringify(data), {
      headers: this.headers(),
    });
  }

  /**
   * Function to send delete request
   * @param url - url to make the request
   * @param data - data to send
   */
  delete<T>(url: string, data?: object): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.headers(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Function to create headers
   * @param extra - extra headers
   */
  headers(extra: Record<string, any> = {}): HttpHeaders {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extra,
    };

    return new HttpHeaders(headers);
  }
}
