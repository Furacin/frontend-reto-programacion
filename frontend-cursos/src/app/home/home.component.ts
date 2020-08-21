import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface Curso {
  id: String,
  titulo: String,
  nivel: String,
  numHoras: String,
  activo: String,
  nombreProfesor: String,
  apellidosProfesor: String 
}

export interface Profesor {
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
  listaCursos: Curso[];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/curso/allCursos').subscribe(data => {
      this.listaCursos = data;
      this.dataSource = new MatTableDataSource<Curso>(this.listaCursos);
      this.dataSource.paginator = this.paginator;
    })
  }

  nuevoCursoDialog() {
    const dialogRef = this.dialog.open(CursoDialogComponent, {
      width: '500px',
      height: '530px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

@Component({
  selector: 'nuevo-curso-dialog',
  templateUrl: 'nuevo-curso-dialog.html',
  styleUrls: ['./home.component.css']
})
export class CursoDialogComponent {
  valor1="";
  valor2=0;

  niveles: Nivel[] = [
    {value: 'Básico'},
    {value: 'Intermedio'},
    {value: 'Avanzado'}
  ];
  profesores: Profesor[];

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CursoDialogComponent>) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/profesor/allProfesores').subscribe(data => {
      this.profesores = data;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close("Thanks for using me!");
  }

}
