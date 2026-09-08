<?php

use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicContentController::class, 'home'])->name('home');
Route::get('viajes', [PublicContentController::class, 'index'])->name('travel-content');
Route::post('contacto', [PublicContentController::class, 'storeContact'])->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Viajes / publicaciones
    Route::get('viajes', [ContentController::class, 'posts'])->name('posts');
    Route::post('viajes', [ContentController::class, 'storePost'])->name('posts.store');
    Route::put('viajes/{post}', [ContentController::class, 'updatePost'])->name('posts.update');
    Route::patch('viajes/{post}/publicar', [ContentController::class, 'togglePost'])->name('posts.toggle');
    Route::delete('viajes/{post}', [ContentController::class, 'destroyPost'])->name('posts.destroy');

    // Reseñas
    Route::get('resenas', [ContentController::class, 'reviews'])->name('reviews');
    Route::post('resenas', [ContentController::class, 'storeReview'])->name('reviews.store');
    Route::put('resenas/{review}', [ContentController::class, 'updateReview'])->name('reviews.update');
    Route::patch('resenas/{review}/publicar', [ContentController::class, 'toggleReview'])->name('reviews.toggle');
    Route::delete('resenas/{review}', [ContentController::class, 'destroyReview'])->name('reviews.destroy');

    // Frases
    Route::get('frases', [ContentController::class, 'quotes'])->name('quotes');
    Route::post('frases', [ContentController::class, 'storeQuote'])->name('quotes.store');
    Route::put('frases/{quote}', [ContentController::class, 'updateQuote'])->name('quotes.update');
    Route::patch('frases/{quote}/publicar', [ContentController::class, 'toggleQuote'])->name('quotes.toggle');
    Route::delete('frases/{quote}', [ContentController::class, 'destroyQuote'])->name('quotes.destroy');

    // Contactos
    Route::get('contactos', [ContentController::class, 'contacts'])->name('contacts');
    Route::patch('contactos/{contact}/leer', [ContentController::class, 'markContactRead'])->name('contacts.read');
    Route::delete('contactos/{contact}', [ContentController::class, 'destroyContact'])->name('contacts.destroy');
});

require __DIR__.'/settings.php';
