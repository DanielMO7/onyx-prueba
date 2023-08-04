<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Controlador que invoca el modelo para obtener los libros.
     *
     * @return void
     */
    public function get_books()
    {
        $consulta = new Book();
        $resultado = $consulta->getBooks();
        return $resultado;
    }

    /**
     * Controlador que invoca las funciones del modelo Book para crear un libro nuevo.
     *
     * @param Request $request
     * @return void
     */
    public function create_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->createBook($request);
        return $resultado;
    }

    /**
     * Controlador que invoca las funciones del modelo Book para actualizar un libro.
     *
     * @param Request $request
     * @return void
     */
    public function updated_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->updatedBook($request);
        return $resultado;
    }

    /**
     * Controlador que invoca las funciones del modelo Book para borrar un libro.
     *
     * @param Request $request
     * @return void
     */
    public function delete_book(Request $request)
    {
        $consulta = new Book();
        $resultado = $consulta->deleteBook($request);
        return $resultado;
    }
}
