import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Curso {
  id: String,
  titulo: String,
  nivel: String,
  numHoras: String,
  activo: String,
  nombreProfesor: String,
  apellidosProfesor: String 
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'nivel', 'numHoras', 'nombreProfesor'];
  listaCursos: Curso[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Simple GET request with response type <any>
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/becas/allCursos').subscribe(data => {
      this.listaCursos  = data;
  })
  }

}
