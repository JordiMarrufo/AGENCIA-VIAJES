<?php

use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\PublicContentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicContentController::class, 'home'])->name('home');
Route::get('viajes', [PublicContentController::class, 'index'])->name('travel-content');
Route::post('contacto', [PublicContentController::class, 'storeContact'])->name('contact.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('contenido', [ContentController::class, 'index'])->name('content');
    Route::post('contenido/viajes', [ContentController::class, 'storePost'])->name('content.posts.store');
    Route::delete('contenido/viajes/{post}', [ContentController::class, 'destroyPost'])->name('content.posts.destroy');
    Route::post('contenido/resenas', [ContentController::class, 'storeReview'])->name('content.reviews.store');
    Route::delete('contenido/resenas/{review}', [ContentController::class, 'destroyReview'])->name('content.reviews.destroy');
    Route::post('contenido/frases', [ContentController::class, 'storeQuote'])->name('content.quotes.store');
    Route::delete('contenido/frases/{quote}', [ContentController::class, 'destroyQuote'])->name('content.quotes.destroy');
    Route::patch('contenido/contactos/{contact}/leer', [ContentController::class, 'markContactRead'])->name('content.contacts.read');
    Route::delete('contenido/contactos/{contact}', [ContentController::class, 'destroyContact'])->name('content.contacts.destroy');
});

require __DIR__.'/settings.php';
