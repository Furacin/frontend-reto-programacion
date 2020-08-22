import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  activo: Boolean;
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
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/curso/allCursosActivos').subscribe(data => {
    this.listaCursos = data;
    this.dataSource = new MatTableDataSource<CursoDTO>(this.listaCursos);
    this.dataSource.paginator = this.paginator;
    })
  }

  /*
  * Abrir dialog para añadir un nuevo curso
  */
  nuevoCursoDialog() {
    const dialogRef = this.dialog.open(CursoDialogComponent, {
      width: '550px',
      height: '610px',
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
  * POST HTTP
  */
  postId; 

  /*
  * Formulario
  */
 nuevoCursoForm: FormGroup;

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CursoDialogComponent>, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    /*
    * Cargamos la lista de profesores en el dropdown
    */
    this.http.get<any>('http://localhost:8080/springboot-mybatis/api/profesor/allProfesores').subscribe(data => {
      this.profesores = data;
    })
    this.nuevoCursoForm = this.formBuilder.group({
      activoCheckboxForm: [null, [Validators.required]],
      profesorDropdownForm: [null, [Validators.required]],
      inputTituloForm: [null, [Validators.required]],
      nivelDropdownForm: [null, [Validators.required]],
      inputHorasForm: [null, [Validators.required]]
    });
  }

  addCurso() {
    let curso: Curso = {
      titulo: this.nuevoCursoForm.value.inputTituloForm, 
      nivel: this.nuevoCursoForm.value.nivelDropdownForm, 
      numHoras: this.nuevoCursoForm.value.inputHorasForm, 
      activo: this.nuevoCursoForm.value.activoCheckboxForm, 
      profesor_id: this.nuevoCursoForm.value.profesorDropdownForm
    };
    if (curso.titulo != null && curso.nivel != null && curso.numHoras != null && curso.activo != null && curso.profesor_id != null) {
      this.http.post<any>('http://localhost:8080/springboot-mybatis/api/curso/addCurso', curso).subscribe(data => {
       this.postId = data.id;
       this.dialogRef.close();
     })
    }
  }

}
