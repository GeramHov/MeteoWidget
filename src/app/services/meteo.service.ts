import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, delay, retry, throwError } from 'rxjs';
import { ErrorService } from './error.service';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class MeteoService {
  private api = environment.apiKey; // GETTING API FROM ENVIRONMENT.TS
  private apiUrl: string; // READY URL
  public city = 'Lyon'; // INITIAL CITY

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.apiUrl =
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
      this.city +
      '&appid=' +
      this.api;
    this.updateApiUrl();
  }

  // SETTING NEW CITY NAME FROM INPUT
  setCity(city: string): void {
    this.city = city;
    this.updateApiUrl();
  }
  //

  //   UPDATE READY URL WITH NEW CITY NAME
  private updateApiUrl(): void {
    this.apiUrl =
      'https://api.openweathermap.org/data/2.5/forecast?q=' +
      this.city +
      '&appid=' +
      this.api;
  }
  //

  //  GETTING METEO DATA PROMISE
  getMeteo(): Observable<any> {
    // console.log(this.apiUrl);

    return this.http
      .get<any>(this.apiUrl)
      .pipe(delay(800), retry(2), catchError(this.errorHandler.bind(this)));
  }
  //

  // HANDLING ERROR
  errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message);
    return throwError(() => error.message);
  }
  //
}
