import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  // URL del localhost
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http : HttpClient) {
  }

  // Trae los libros de la base de datos.
  getBooks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/books`);
  }

  // Crea los libros
  createBook(data:any): Observable<any> {
    return this.http.post<any>((`${this.apiUrl}/create-book`), data);
  }

  // Edita o Actualiza un libro
  updateBook(data:any): Observable<any> {
    return this.http.post<any>((`${this.apiUrl}/updated-book`), data);
  }

  // Elimina un Libro
  deleteBook(data:any): Observable<any> {
    return this.http.post<any>((`${this.apiUrl}/delete-book`), data);

  }

}
