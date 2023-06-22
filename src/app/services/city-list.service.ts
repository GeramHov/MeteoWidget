import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityListService {
  // CONNECT TO CITY NAMES JSON
  private path = '../../../assets/data/city.list.json';

  constructor(private http: HttpClient) {}

  // GETTING DATA PROMISE
  getAllCities(): Observable<any> {
    return this.http.get<any>(this.path);
  }
}
