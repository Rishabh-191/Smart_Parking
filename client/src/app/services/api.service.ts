import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = Constants.API_BASE_URL;

  constructor(private http: HttpClient) { }

  login(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, post);
  }

  updateUser(post: any, id: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/update/${id}`, post);
  }

  updateParking(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateParking`, post);
  }

  addBooking(post: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/booking/add`, post);
  }

  getBookingById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/booking/getById/${id}`);
  }

  getParking(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/parking/getAll`);
  }

  deleteBooking(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/booking/delete/${id}`);
  }

  getUserById(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/getById/${id}`);
  }

  updateBooking(post: any, id: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/booking/update/${id}`, post);
  }

  updateBalance(post: any, id: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/updateBalance/${id}`, post);
  }

}
