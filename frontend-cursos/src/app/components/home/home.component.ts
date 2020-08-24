import { Component, OnInit, ViewChild} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Curso } from '../../models/curso';
import { ProfesorDTO } from '../../dto/profesordto'
import { CursoDTO } from '../../dto/cursodto'
 
import { ProfesorService } from '../../services/profesor.service'
import { CursoService } from '../../services/curso.service'

export interface Nivel {
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'nombreProfesor', 'nivel', 'numHoras', 'temario'];
  listaCursos: CursoDTO[];
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private cursoSrv: CursoService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCursos();
  }

  getCursos() {
    /*
    * Cargamos la lista de cursos disponibles
    */
    this.cursoSrv.getAllCursosActivos().subscribe(data => {
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
      width: '570px',
      height: '680px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getCursos();
    });
  }

  /*
  * Descarga de temario
  */

  descargarTemario(row) {
    var temarioPDF = row.temario;
    const linkSource = `data:application/pdf;base64,${temarioPDF}`;
    const downloadLink = document.createElement("a");
    const fileName = "Temario - " + row.titulo + ".pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
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
  profesores: ProfesorDTO[];

  /*
  * Formulario
  */
 nuevoCursoForm: FormGroup;

 /*
 * Archivo con el temario para seleccionar
 */
 temarioFile: File; 
 temarioBase64: String;
 nombreTemarioSubido: String = "Ningún archivo seleccionado";

  constructor(private cursoSrv: CursoService, private profesorSrv: ProfesorService, public dialogRef: MatDialogRef<CursoDialogComponent>, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    /*
    * Cargamos la lista de profesores en el dropdown
    */
    this.profesorSrv.getProfesores().subscribe(data => {
      this.profesores = data;
    })
    this.nuevoCursoForm = this.formBuilder.group({
      activoCheckboxForm: [false, [Validators.required]],
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
      profesor_id: this.nuevoCursoForm.value.profesorDropdownForm,
      temario: this.temarioBase64
    };
    if (curso.titulo != null && curso.nivel != null && curso.numHoras != null && curso.activo != null && curso.profesor_id != null && curso.temario != null) {
       this.cursoSrv.addCurso(curso).subscribe(data => {
       this.dialogRef.close();
     })
    }
  }

  /**
   * Subida del pdf con el temario
   */ 
  openInput(){ 
    // your can use ElementRef for this later
    document.getElementById("fileInput").click();
  }
  // FileReader para leer el fichero
  fileChange(files: File[]) {
    if ( /\.(pdf)$/i.test(files[0].name) === false ) {
       alert("Por favor, selecciona un temario en formato PDF");
    }
    else {
      this.nombreTemarioSubido = files[0].name;
      if (files.length > 0) {
        this.temarioFile = files[0];
        // FileReader function for read the file.
        var fileReader = new FileReader();
        fileReader.onload = this._handleReaderLoaded.bind(this);
        fileReader.readAsBinaryString(this.temarioFile);
      }
    }
  }
  //Guardamos el fichero en formato Base64 
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
      this.temarioBase64= btoa(binaryString);
   }

}
