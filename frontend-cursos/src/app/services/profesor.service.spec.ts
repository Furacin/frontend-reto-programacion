import { TestBed, getTestBed  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProfesorService } from './profesor.service'

describe('#ProfesorService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let profesorSrv: ProfesorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfesorService]
    })
    injector = getTestBed();
    profesorSrv = injector.get(ProfesorService)
    httpMock = injector.get(HttpTestingController)
  });
  
  it('Obtener la lista de profesores', () => {

    const dummyProfesores = [
      { id: 1, nombre: 'Roberto', apellidos: 'Canales' },
      { id: 2, nombre: 'Alberto', apellidos: 'Moratilla' }
    ];

    profesorSrv.getProfesores().subscribe(profesores => {
      expect(profesores).toEqual(dummyProfesores);
    });

    const req = httpMock.expectOne(`${profesorSrv.API_URL}/allProfesores`);
    expect(req.request.method).toBe("GET");
  });
});
