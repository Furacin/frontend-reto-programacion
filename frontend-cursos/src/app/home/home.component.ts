import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

export interface Curso {
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
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Simple GET request with response type <any>
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/becas/allCursos').subscribe(data => {
      this.listaCursos  = data;
      this.dataSource = new MatTableDataSource<Curso>(this.listaCursos);
      this.dataSource.paginator = this.paginator;
    })
  }

}
