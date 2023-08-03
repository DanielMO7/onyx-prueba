<?php

use App\Http\Controllers\BookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(BookController::class)->group(function () {
    Route::get('books', 'get_books');
    Route::post('create-book', 'create_book');
    Route::post('updated-book', 'updated_book');
    Route::post('delete-book', 'delete_book');
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
