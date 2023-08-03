import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http : HttpClient) {
  }

  getBooks(){
    return this.http.get<any>((`${this.apiUrl}/books`));
  }

}