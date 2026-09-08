<?php

namespace App\Http\Controllers;

use App\Models\CompanyQuote;
use App\Models\ContactMessage;
use App\Models\Review;
use App\Models\TravelPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('travel-content', [
            'posts' => TravelPost::where('is_published', true)->latest('published_at')->get(),
            'reviews' => Review::where('is_published', true)->latest()->get(),
            'quotes' => CompanyQuote::where('is_published', true)->latest()->get(),
        ]);
    }

    public function storeContact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:40'],
            'message' => ['required', 'string', 'max:3000'],
        ]);
        ContactMessage::create($data);

        return back()->with('success', 'Gracias por escribirnos. Te contactaremos pronto.');
    }
}
