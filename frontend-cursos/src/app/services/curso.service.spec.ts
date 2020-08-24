import { TestBed, getTestBed  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CursoService } from './curso.service'

describe('#ProfesorService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let cursoSrv: CursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CursoService]
    })
    injector = getTestBed();
    cursoSrv = injector.get(CursoService)
    httpMock = injector.get(HttpTestingController)
  });
  
    it('Obtener la lista de cursos', () => {

        const dummyCursos = [   
        { id: 1, titulo: 'Introduccion a JSF2', nivel: 'Intermedio', numHoras: '25', activo: true, nombreProfesor: "Roberto", apellidosProfesor: "Canales", temario: "AAAA" },
        { id: 2, titulo: 'Angular 2', nivel: 'Basico', numHoras: '45', activo: true, nombreProfesor: "Roberto", apellidosProfesor: "Canales", temario: "BBBBB" },
        ];

        cursoSrv.getAllCursosActivos().subscribe( cursos => {
        expect(cursos).toEqual(dummyCursos);
        });

        const req = httpMock.expectOne(`${cursoSrv.API_URL}/allCursosActivos`);
        expect(req.request.method).toBe("GET");
    });

    it('Añadir un curso nuevo', () => {

        const dummyCurso = [   
        { id: 1, titulo: 'Introduccion a JSF2', nivel: 'Intermedio', numHoras: '25', activo: true, nombreProfesor: "Roberto", apellidosProfesor: "Canales", temario: "AAAA" }
        ];

        cursoSrv.addCurso(dummyCurso).subscribe( curso => {
        expect(curso).toEqual(dummyCurso);
        });

        const req = httpMock.expectOne(`${cursoSrv.API_URL}/addCurso`);
        expect(req.request.method).toBe("POST");
    });
});
