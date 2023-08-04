import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { GeneralService } from './general.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GeneralService', () => {
  let service: GeneralService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeneralService]
    });

    service = TestBed.inject(GeneralService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe buscar datos de libros', fakeAsync(() => {
    const mockResponse = {
      status: 1,
      data: [
        {
          id: 1,
          title: 'Test Book',
          author: 'Test Author',
          year_publication: 2023,
          genre: 'Test Genre'
        }
      ]
    };

    let responseData: any;

    // Act
    service.getBooks().subscribe((response) => {
      responseData = response;
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/books');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    // Esperar a que las operaciones asincrónicas se completen
    tick();

    // Assert
    expect(responseData).toBeTruthy();
    expect(responseData.status).toBe(1);
    expect(responseData.data.length).toBe(1);
    expect(responseData.data[0].id).toBe(1);
    expect(responseData.data[0].title).toBe('Test Book');
    expect(responseData.data[0].author).toBe('Test Author');
    expect(responseData.data[0].year_publication).toBe(2023);
    expect(responseData.data[0].genre).toBe('Test Genre');
  }));
});
