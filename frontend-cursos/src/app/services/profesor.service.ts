import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {

  constructor(private http: HttpClient) { }

  public getProfesores() {
    return this.http.get<any>('http://localhost:8080/springboot-mybatis/api/profesor/allProfesores');
  }
}