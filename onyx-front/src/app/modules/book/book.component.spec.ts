import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BookComponent } from './book.component';
import { GeneralService } from '../general.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import Swal, { SweetAlertResult } from 'sweetalert2';

describe('BookComponent', () => {
  let component: BookComponent;
  let fixture: ComponentFixture<BookComponent>;
  let mockGeneralService: jasmine.SpyObj<GeneralService>;
  let mockBookData: any;
  let bookToUpdate: any;

  beforeEach(async () => {
    mockGeneralService = jasmine.createSpyObj<GeneralService>(
      'GeneralService',
      ['getBooks', 'createBook', 'updateBook', 'deleteBook']
    );

    // Configurar el método getBooks() del servicio simulado para devolver datos simulados
    mockBookData = {
      status: 1,
      data: [
        {
          id: 1,
          title: 'Test Book',
          author: 'Test Author',
          year_publication: 2023,
          genre: 'Test Genre',
        },
      ],
    };
    mockGeneralService.getBooks.and.returnValue(of(mockBookData));
    mockGeneralService.createBook.and.callFake((data) => {
      const newBook = {
        id: 2,
        title: data.title,
        author: data.author,
        year_publication: data.year_publication,
        genre: data.genre,
      };
      return of({ status: 1, data: newBook });
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [BookComponent],
      providers: [
        { provide: GeneralService, useValue: mockGeneralService },
        FormBuilder,
      ],
    }).compileComponents();
  });

  afterEach(() => {
    // Limpiar los espías después de cada prueba
    mockGeneralService.deleteBook.calls.reset();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookComponent);
    component = fixture.componentInstance;

    // Establecer valores para formUpdateBook
    component.formUpdateBook.reset(); // Limpia cualquier valor previo
    bookToUpdate = {
      id: 1,
      title: 'Updated Book',
      author: 'Updated Author',
      year_publication: 2023,
      genre: 'Updated Genre',
    };
    component.formUpdateBook.setValue(bookToUpdate);
    fixture.detectChanges();
  });

  it('Debe actualizar un libro y actualizar la lista', waitForAsync(() => {
    // Arrange
    const mockUpdateBookData = {
      status: 1,
      data: {
        id: 1,
        title: 'Updated Book',
        author: 'Updated Author',
        year_publication: 2023,
        genre: 'Updated Genre',
      },
    };

    mockGeneralService.updateBook.and.returnValue(of(mockUpdateBookData));

    // Act
    component.formUpdateBook.setValue(mockUpdateBookData.data);

    component.saveUpdateBook();

    // Assert
    expect(mockGeneralService.updateBook).toHaveBeenCalledWith(
      mockUpdateBookData.data
    );
    expect(component.books.length).toBe(1);
    expect(component.books[0]).toEqual(mockUpdateBookData.data);
  }));

  it('Debe eliminar un libro y eliminarlo de la lista', fakeAsync(() => {
    // Arrange
    const mockDeleteBookData = { status: 1 };
    const bookToDelete = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      year_publication: 2023,
      genre: 'Test Genre',
    };
    mockGeneralService.deleteBook.and.returnValue(of(mockDeleteBookData));

    // Set up the initial list of books
    component.books = [bookToDelete];

    const swalResult: SweetAlertResult<any> = {
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    };
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(swalResult));

    // Act
    component.deleteBook(bookToDelete);

    // Esperar a que las operaciones asincrónicas se completen
    tick();

    // Assert
    // Verificar que deleteBook haya sido llamado con el id del libro a eliminar
    expect(mockGeneralService.deleteBook).toHaveBeenCalledWith({
      id: bookToDelete.id,
    });

    // Verificar que el libro ha sido eliminado de la lista
    expect(component.books.length).toBe(0);

    // Verificar que Swal.fire haya sido llamado con los argumentos correctos
    expect(Swal.fire).toHaveBeenCalledWith({
      title: '¿Seguro que Deseas Borrar "' + bookToDelete.title + '" ?',
      text: 'Esto borrara el libro completamente, estas seguro?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
    } as any);
  }));

  // it('Debe crear un nuevo libro y agregarlo a la lista', fakeAsync(() => {
  //   // Arrange
  //   const newBook = {
  //     title: 'Test Book',
  //     author: 'Test Author',
  //     year_publication: 2023,
  //     genre: 'Test Genre',
  //   };

  //   mockGeneralService.createBook.and.returnValue(of({
  //     status: 1,
  //     data: newBook,
  //   }));

  //   // Act
  //   component.formCreateBook.setValue(newBook);
  //   component.saveCrateBook();
  //   tick(); // Esperar a que se resuelva la operación asincrónica
  //   fixture.detectChanges();

  //   // Assert
  //   expect(mockGeneralService.createBook).toHaveBeenCalledWith(newBook);
  //   expect(component.formCreateBook.valid).toBe(true);
  //   expect(component.books.length).toBe(1);
  //   expect(component.books[0]).toEqual(jasmine.objectContaining(newBook));
  // }));
});
