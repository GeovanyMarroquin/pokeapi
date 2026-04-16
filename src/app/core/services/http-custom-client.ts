import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiRequestOptions } from '@core/interfaces/http-client';

@Injectable({
  providedIn: 'root',
})
export class HttpCustomClient {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http
      .get<T>(url, httpOptions)
      .pipe(catchError((error) => this.handleError(error, options)));
  }

  post<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http
      .post<T>(url, body, httpOptions)
      .pipe(catchError((error) => this.handleError(error, options)));
  }

  put<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http
      .put<T>(url, body, httpOptions)
      .pipe(catchError((error) => this.handleError(error, options)));
  }

  patch<T>(endpoint: string, body: unknown, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http
      .patch<T>(url, body, httpOptions)
      .pipe(catchError((error) => this.handleError(error, options)));
  }

  delete<T>(endpoint: string, options: ApiRequestOptions = {}): Observable<T> {
    const url = this.getFullUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http
      .delete<T>(url, httpOptions)
      .pipe(catchError((error) => this.handleError(error, options)));
  }

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;

    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  private buildHttpOptions(options: ApiRequestOptions): Record<string, unknown> {
    const httpOptions: Record<string, unknown> = {};

    if (options.headers) {
      httpOptions['headers'] = options.headers;
    }

    if (options.params) {
      httpOptions['params'] = options.params;
    }

    return httpOptions;
  }

  private handleError(error: HttpErrorResponse, options: ApiRequestOptions): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorDetail = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Error de conexión';
      errorDetail = error.error.message;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Sin conexión al servidor';
          errorDetail = 'Verifique su conexión a internet o que el servidor esté activo';
          break;
        case 400:
          errorMessage = 'Solicitud inválida';
          break;
        case 401:
          errorMessage = 'No autorizado';
          errorDetail = 'Debe iniciar sesión para continuar';
          break;
        case 403:
          errorMessage = 'Acceso denegado';
          errorDetail = 'No tiene permisos para realizar esta acción';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          errorDetail = 'El recurso solicitado no existe';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          errorDetail = 'Ocurrió un error en el servidor. Intente más tarde';
          break;
        case 503:
          errorMessage = 'Servicio no disponible';
          errorDetail = 'El servidor está temporalmente fuera de servicio';
          break;
        default:
          errorMessage = `Error ${error.status}`;
          errorDetail = error.message || 'Ocurrió un error desconocido';
      }
    }

    // No inclui una libreria de alertas :(
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      detail: errorDetail,
      originalError: error,
    }));
  }
}
