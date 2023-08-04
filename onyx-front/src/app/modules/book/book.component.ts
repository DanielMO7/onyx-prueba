import { Component } from '@angular/core';
import { GeneralService } from '../general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';
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
    // Se crea un build del formulario de creación para poder trabajar didácticamente con el.
    this.formCreateBook = this.form_create_book.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });

    // Se crea un build del formulario de edición para poder trabajar didácticamente con el.
    this.formUpdateBook = this.form_update_book.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });
    this.loadingPague = true;

    // Petición HTTP que trae todos los libros que estén en la base de datos.
    this.generalService.getBooks().subscribe(
      (data) => {
        if (data.status == 1) {
          // Status 1 | Todo salio correctamente.
          this.books = data.data;
          this.loadingPague = false;
          // console.log(this.books);
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

  /**
   * Permite verificar que tipo de formulario desea usar el usuario. Abre el dialog que contiene el formulario
   * ya sea de edición o de creación de libros.
   *
   * @param tipo_form boolean | Verifica si el formularios es de creación o de edición.
   * @param data object | Objeto que contienen los datos necesarios para editar.
   */
  openForm(tipo_form: boolean, data: any | null = '') {
    if (tipo_form) {
      this.typeForm = true; // Agregar
    } else {
      this.typeForm = false; // Actualizar
      if (data) {
        // Asigna los datos recibidos como parámetro al formulario de edición de libros.
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

  /**
   *  Realiza la petición y validación de los datos del formulario de creación de libro. Verifica que los datos
   *  este correctamente estructurado y los posibles errores de las peticiones HTTP que se puedan presentar.
   */
  saveCrateBook() {
    // Verifica si el formulario es valido.
    if (this.formCreateBook.valid) {
      this.loadingCrud = true;
      // Petición HTTP que permite crear el Libro. Se pasa como parámetro el formulario de creación.
      this.generalService.createBook(this.formCreateBook.value).subscribe(
        (data) => {
          // Status 1 | Todo salio correctamente.
          if (data.status == 1) {
            // data.data | Contiene los datos del nuevo libro que se acaba de crear con su respectivo ID.
            this.books.push(data.data);

            // Alert para mostrar que todo salio correctamente.
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
            // Cierra el Crud.
            this.closeCrud();
          }
        },
        (error) => {
          // Validación de Errores en la petición.
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

  /**
   *  Realiza la petición y validación de los datos del formulario de actualización de un libro. Verifica que los datos
   *  este correctamente estructurados y los posibles errores de las peticiones HTTP que se puedan presentar.
   */
  saveUpdateBook() {
    // Valida el formulario.
    if (this.formUpdateBook.valid) {
      this.loadingCrud = true;
      // Crea un objeto con los datos del formulario para enviarlos como parámetro a la petición HTTP de Actualización
      const bookToUpdate = {
        id: this.formUpdateBook.value.id,
        title: this.formUpdateBook.value.title,
        author: this.formUpdateBook.value.author,
        year_publication: this.formUpdateBook.value.year_publication,
        genre: this.formUpdateBook.value.genre,
      };
      // Petición HTTP que permite la actualización de un libro recibiendo su info como parámetro.
      this.generalService.updateBook(bookToUpdate).subscribe(
        (data) => {
          // Status 1 | Todo salio correctamente.
          if (data.status == 1) {
            // Iteramos en los libros para buscar el libro que se acaba de editar.
            for (let i = 0; i < this.books.length; i++) {
              // Cuando lo encuentre es remplazado por el libro recibido como parámetro.
              if (this.books[i].id === this.formUpdateBook.value.id) {
                this.books[i] = data.data;
                break;
              }
            }
            // Alert que especifica que todo salio correctamente.
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

            // Cerramos el Crud
            this.closeCrud();
          }
        },
        (error) => {
          // Validamos los posibles errores HTTP que se puedan presentar.
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

  /**
   * Función que realiza la petición HTTP para borrar un libro y eliminarlo de la web.
   * @param book object | Objeto del libro que se desea eliminar.
   */
  deleteBook(book: any) {
    // Alert que permite realizar verificaciones antes de borrar un elemento.
    Swal.fire({
      title: '¿Seguro que Deseas Borrar "' + book.title + '" ?',
      text: 'Esto borrara el libro completamente, estas seguro?!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo!',
      // result Contiene la respuesta del usuario al Alert
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario esta seguro de eliminar.

        // Se realiza la petición HTTP para realizar la eliminación del libro recibiendo como parámetro el libro a eliminar.
        this.generalService.deleteBook({ id: book.id }).subscribe(
          (data) => {
            // status 1 | Todo salio correctamente.
            if (data.status == 1) {

              // Iteramos en los libros para buscar la posición del elemento que se acaba de eliminar.
              for (let i = 0; i < this.books.length; i++) {
                if (this.books[i].id === book.id) {
                  // Una vez encontrado se elimina del array el libro creado.
                  this.books.splice(i, 1);
                  break;
                }
              }
              // Mensaje que muestra que todo salio correctamente.
              Swal.fire('Borrado!', 'Libro Borrado Correctamente.', 'success');
            }
          },
          (error) => {
            // Validación de Errores en la consulta HTTP.
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

  /** Cierra el Crud y reinicia las variables del flujo del CRUD y reinicia los formularios de creció y edición.*/
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
