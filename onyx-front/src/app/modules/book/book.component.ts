import { Component } from '@angular/core';
import { GeneralService } from '../general.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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

  formCreateBook: FormGroup;
  formUpdateBook: FormGroup;

  submittedForm: boolean = false;

  constructor(
    private generalService: GeneralService,
    private form_create_book: FormBuilder,
    private form_update_book: FormBuilder
  ) {
    this.formCreateBook = this.form_create_book.group({
      title: ['',Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });

    this.formUpdateBook = this.form_update_book.group({
      id: ['', Validators.required],
      title: ['',Validators.required],
      author: ['', Validators.required],
      year_publication: ['', Validators.required],
      genre: ['', Validators.required],
    });

    this.generalService.getBooks().subscribe((data) => {
      if (data.status == 1) {
        this.books = data.data;
        console.log(this.books);
      }
    });
  }

  openForm(tipo_form: boolean) {
    if (tipo_form) {
      this.typeForm = true; // Agregar
    } else {
      this.typeForm = false; // Actualizar
    }

    this.openCrudBook = true;
  }

  saveCrateBook() {}
  saveUpdateBook() {}

  closeCrud() {
    this.submittedForm = false;
    this.typeForm = false;
    this.openCrudBook = false;
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
