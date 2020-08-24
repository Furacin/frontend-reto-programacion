import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CursoService {

    readonly API_URL = 'http://localhost:8080/springboot-mybatis/api/curso';

    constructor(private http: HttpClient) { }

    public getAllCursosActivos() {
        return this.http.get<any>('http://localhost:8080/springboot-mybatis/api/curso/allCursosActivos');
    }

    public addCurso(curso) {
        return this.http.post<any>('http://localhost:8080/springboot-mybatis/api/curso/addCurso', curso);
    } 
}