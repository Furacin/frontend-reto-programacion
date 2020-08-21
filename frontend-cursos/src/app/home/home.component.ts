import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';

export class CursoDTO {
  titulo: String;
  nivel: String;
  numHoras: String;
  activo: String;
  nombreProfesor: String;
  apellidosProfesor: String 
}

export class Curso {
  titulo: String;
  nivel: String;
  numHoras: String;
  activo: String;
  profesor_id: number;
}

export class Profesor {
  value: string;
  viewValue: string;
}

export interface Nivel {
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'nombreProfesor', 'nivel', 'numHoras'];
  listaCursos: CursoDTO[];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCursos();
  }

  getCursos() {
    /*
    * Cargamos la lista de cursos disponibles
    */
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/curso/allCursos').subscribe(data => {
    this.listaCursos = data;
    this.dataSource = new MatTableDataSource<CursoDTO>(this.listaCursos);
    this.dataSource.paginator = this.paginator;
    })
  }

  nuevoCursoDialog() {
    const dialogRef = this.dialog.open(CursoDialogComponent, {
      width: '500px',
      height: '530px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCursos();
    });
  }

}

@Component({
  selector: 'nuevo-curso-dialog',
  templateUrl: 'nuevo-curso-dialog.html',
  styleUrls: ['./home.component.css']
})
export class CursoDialogComponent {

  /*
  * Dropdown - Niveles
  */
  niveles: Nivel[] = [
    {value: 'Básico'},
    {value: 'Intermedio'},
    {value: 'Avanzado'}
  ];

  /* Lista de profesores
  *
  */
  profesores: Profesor[];

  /*
  * Valores del dialog
  */
  activoChecked: boolean = false;
  tituloCursoInput: String;
  numHorasInput: String;
  selectedProfesor: number;
  selectedNivel: string;

  /*
  * POST HTTP
  */
  postId; 

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CursoDialogComponent>) {}

  ngOnInit(): void {
    /*
    * Cargamos la lista de profesores en el dropdown
    */
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/profesor/allProfesores').subscribe(data => {
      this.profesores = data;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addCurso() {
    let curso: Curso = {
      titulo: this.tituloCursoInput, 
      nivel: this.selectedNivel, 
      numHoras: this.numHorasInput, 
      activo: this.activoChecked ? 'SI' : 'NO', 
      profesor_id: this.selectedProfesor
    };
    
    this.http.post<any>('http://localhost:8080/springboot-mybatis/api/curso/addCurso', curso).subscribe(data => {
      this.postId = data.id;
      this.dialogRef.close();
    })
  }

}
