<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

class Book extends Model
{
    use HasFactory;

    /**
     * Retorna los libros que se encuentren guardados en la base de datos haciendo uso de eloquent.
     *
     * @return json
     */
    public function getBooks()
    {
        try {
            $book = Book::all(); // Obtiene todos los libros de la base de datos.

            // Json Response con los datos encontrados del libro.
            return response()->json([
                'status' => 1,
                'msg' => 'Libros entregados correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            // Retorna errores al consultar los datos.
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    /**
     * Realiza la validación de campos necesarios para la creación de un libro, ademas inserta los valores
     * en la base de datos del nuevo libro. Retorna un json que contiene el libro que se aca de crear con su ID.
     *
     * @param object $request | Información necesaria para la creación del libro.
     * @return json
     */
    public function createBook($request)
    {
        // Valida los campos necesarios para realizar una correcta creación de un libro.
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'author' => 'required|string',
            'year_publication' => 'required|integer|min:1800|max:2023',
            'genre' => 'required|string'
        ]);

        // Si se encuentra algún error en los datos de validación entonce retorna un json responde 422 con el error.
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }
        // Si los datos se validan correctamente entonces se realiza la creación del libro.
        try {
            // Se crea el libro con eloquent:
            $book = new Book();
            $book->title = $request->title;
            $book->author = $request->author;
            $book->year_publication = $request->year_publication;
            $book->genre = $request->genre;
            $book->save();

            // Se retorna json con el valor del libro creado.
            return response()->json([
                'status' => 1,
                'msg' => 'Libros creado correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            // Retorna los posibles errores al realizar la creación.
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    /**
     * Realiza la validación de campos necesarios para la actualización de un libro, ademas actualiza los valores
     * en la base de datos del libro. Retorna un json que contiene el libro que se aca de actualizar.
     *
     * @param object $request | Información necesaria para la actualización del libro.
     * @return json
     */
    public function updatedBook($request)
    {
        // Valida los campos necesarios para realizar una correcta actualización de un libro.
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'title' => 'required|string',
            'author' => 'required|string',
            'year_publication' => 'required|integer|min:1800|max:2023',
            'genre' => 'required|string'
        ]);
        // Si se encuentra algún error en los datos de validación entonce retorna un json responde 422 con el error.
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }

        // Si los datos se validan correctamente entonces se realiza la actualización del libro.
        try {
            $book = Book::findOrFail($request->id); // Busca el ID del libro que se recibe como parámetro.  O retorna un error.
            // Se asignan los datos recibidos.
            $book->title = $request->title;
            $book->author = $request->author;
            $book->year_publication = $request->year_publication;
            $book->genre = $request->genre;
            $book->save();

            // Se retorna json con el valor del libro creado.
            return response()->json([
                'status' => 1,
                'msg' => 'Libro actualizado correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            // Retorna los posibles errores al realizar la creación.
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    /**
     * Realiza la validación de campos necesarios para borrar un libro, ademas borra los valores
     * en la base de datos del libro. Retorna un json un respuesta acerca del estado de la petición.
     *
     * @param object $request | Información necesaria para la actualización del libro.
     * @return json
     */
    public function deleteBook($request)
    {
        // Valida los campos necesarios para realizar una correcta actualización de un libro.
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
        ]);
        // Si se encuentra algún error en los datos de validación entonce retorna un json responde 422 con el error.
        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }
        try {
            $book = Book::findOrFail($request->id); // Busca el ID del libro que se recibe como parámetro. O retorna un error.
            $book->delete(); // Se borra el libro encontrado

            // Se retorna json con el valor del libro creado.
            return response()->json([
                'status' => 1,
                'msg' => 'Libro Borrado correctamente',
            ], 200);
        } catch (QueryException $e) {
            // Retorna los posibles errores al realizar la creación.
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }
}
