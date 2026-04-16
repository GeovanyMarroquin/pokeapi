import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiRequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams | { [param: string]: string | string[] };
}