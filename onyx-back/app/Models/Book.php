<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Validator;

class Book extends Model
{
    use HasFactory;
    public function getBooks()
    {
        try {
            $book = Book::all();

            return response()->json([
                'status' => 1,
                'msg' => 'Libros entregados correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    public function createBook($request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'author' => 'required|string',
            'year_publication' => 'required|integer|min:1800|max:2023',
            'genre' => 'required|string'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }
        try {
            $book = new Book();
            $book->title = $request->title;
            $book->author = $request->author;
            $book->year_publication = $request->year_publication;
            $book->genre = $request->genre;
            $book->save();

            return response()->json([
                'status' => 1,
                'msg' => 'Libros creado correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    public function updatedBook($request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'title' => 'required|string',
            'author' => 'required|string',
            'year_publication' => 'required|integer|min:1800|max:2023',
            'genre' => 'required|string'
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }
        try {
            $book = Book::findOrFail($request->id);
            $book->title = $request->title;
            $book->author = $request->author;
            $book->year_publication = $request->year_publication;
            $book->genre = $request->genre;
            $book->save();

            return response()->json([
                'status' => 1,
                'msg' => 'Libro actualizado correctamente',
                'data' => $book
            ], 200);
        } catch (QueryException $e) {
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }

    public function deleteBook($request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors()->all();
            return response()->json([
                'message' => 'Ha ocurrido un error de validación.',
                'errors' => $errors
            ], 422);
        }
        try {
            $book = Book::findOrFail($request->id);
            $book->delete();
            return response()->json([
                'status' => 1,
                'msg' => 'Libro Borrado correctamente',
            ], 200);
        } catch (QueryException $e) {
            return  response()->json([
                'status' => 0,
                'msg' => 'Ha ocurrido un error interno.',
                'data' => $e
            ], 500);
        }
    }
}
