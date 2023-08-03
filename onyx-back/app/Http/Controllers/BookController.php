<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function get_books()
    {
        $consulta = new Book();
        $resultado = $consulta->getBooks();
        return $resultado;
    }

    public function create_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->createBook($request);
        return $resultado;
    }

    public function updated_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->updatedBook($request);
        return $resultado;
    }

    public function delete_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->deleteBook($request);
        return $resultado;
    }
}
