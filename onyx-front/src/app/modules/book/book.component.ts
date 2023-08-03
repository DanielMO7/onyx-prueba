import { Component } from '@angular/core';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  books: any[]= [];

  constructor(
    private generalService: GeneralService
  ){

    this.generalService.getBooks().subscribe((data) => {
      if(data.status == 1){
        this.books = data.data;
        console.log(this.books);
      }
    })

  }
}
