import { Component } from '@angular/core';
import { GeneralService } from '../general.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent {
  books: any[] = [];

  openCrudBook: boolean = false;

  typeForm: boolean = false;

  loadingCrud: boolean = false;
  loadingPague: boolean = false;

  formCreateBook: FormGroup;
  formUpdateBook: FormGroup;

  submittedForm: boolean = false;

  constructor(
    private generalService: GeneralService,
    private form_create_book: FormBuilder,
    private form_update_book: FormBuilder
  ) {
    this.formCreateBook = this.form_create_book.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });

    this.formUpdateBook = this.form_update_book.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });
    this.loadingPague = true;
    this.generalService.getBooks().subscribe(
      (data) => {
        if (data.status == 1) {
          this.books = data.data;
          this.loadingPague = false;
          console.log(this.books);
        }
      },
      (error) => {
        if (error.status == 500) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ha Ocurrido un Error Interno!',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    );
  }

  openForm(tipo_form: boolean, data: any | null = '') {
    if (tipo_form) {
      this.typeForm = true; // Agregar
    } else {
      this.typeForm = false; // Actualizar
      if (data) {
        this.formUpdateBook = this.form_update_book.group({
          id: [data.id, Validators.required],
          title: [data.title, Validators.required],
          author: [data.author, Validators.required],
          year_publication: [
            Number(data.year_publication),
            Validators.required,
          ],
          genre: [data.genre, Validators.required],
        });
      }
    }
    this.openCrudBook = true;
  }

  saveCrateBook() {
    if (this.formCreateBook.valid) {
      this.loadingCrud = true;
      this.generalService.createBook(this.formCreateBook.value).subscribe(
        (data) => {
          if (data.status == 1) {
            this.books.push(data.data);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title:
                'Libro "' +
                this.formCreateBook.value.title +
                '" Agregado Correctamente!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.loadingCrud = false;
            this.closeCrud();
          }
        },
        (error) => {
          if (error.status == 500) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Ha Ocurrido un Error Interno!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
          this.loadingCrud = false;
        }
      );
    }
  }
  saveUpdateBook() {
    if (this.formUpdateBook.valid) {
      this.loadingCrud = true;
      console.log(this.formUpdateBook.value);
      this.generalService.updateBook(this.formUpdateBook.value).subscribe(
        (data) => {
          if (data.status == 1) {
            for (let i = 0; i < this.books.length; i++) {
              if (this.books[i].id === this.formUpdateBook.value.id) {
                this.books[i] = data.data;
                break;
              }
            }
            Swal.fire({
              position: 'center',
              icon: 'success',
              title:
                'Libro "' +
                this.formUpdateBook.value.title +
                '" Actualizado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
            this.loadingCrud = false;
            this.closeCrud();
          }
        },
        (error) => {
          if (error.status == 500) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Ha Ocurrido un Error Interno!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
          this.loadingCrud = false;
        }
      );
    }
  }

  deleteBook(book: any) {
    Swal.fire({
      title: '¿Seguro que Deseas Borrar "' + book.title + '" ?',
      text: 'Esto borrara el libro completamente, estas seguro?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.generalService.deleteBook(book.id).subscribe(
          (data) => {
            if (data.status == 1) {
              for (let i = 0; i < this.books.length; i++) {
                if (this.books[i].id === this.formUpdateBook.value.id) {
                  this.books.splice(i, 1);
                  break;
                }
              }
              Swal.fire('Borrado!', 'Libro Borrado Correctamente.', 'success');
            }
          },
          (error) => {
            if (error.status == 500) {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ha Ocurrido un Error Interno!',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          }
        );
      }
    });
  }

  closeCrud() {
    this.submittedForm = false;
    this.typeForm = false;
    this.openCrudBook = false;
    this.formCreateBook.reset();
    this.formUpdateBook.reset();
  }

  /**
   * Permite asignar estilos a los inputs que sean erróneos o que no estén validados en el formulario.
   * @param controlName | Nombre del Input que se desea validar.
   * @returns
   */
  classInputError(controlName: string) {
    const control = this.typeForm
      ? this.formCreateBook.get(controlName)
      : this.formUpdateBook.get(controlName);

    if (
      (control?.invalid && control.touched) ||
      (control?.invalid && this.submittedForm)
    ) {
      return {
        'border-2': true,
        'border-red-500': true,
        'text-red-600': true,
        'focus:ring-0': true,
        'opacity-100': false,
      };
    }

    return {};
  }

  /**
   * Permite validar si el formulario contiene algún error en la etiqueta que se recibe como parámetro. Se utiliza para mostrar errores
   * en caso de que lo halla en el formulario.
   * @param tagName HTML Etiqueta | Nombre de
   * @param submitted boolean | Botón que verifica si el formulario fue enviado.
   * @returns boolean
   */
  validarInputEvent(tagName: string, submitted: boolean): boolean {
    const control = this.typeForm
      ? this.formCreateBook.get(tagName)
      : this.formUpdateBook.get(tagName);

    if (
      // Valida si el formulario fue enviado y el valor es invalido o Si el formulario fue tocado y contiene algún error.
      (submitted && control?.invalid) ||
      control?.dirty ||
      control?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }
}
