<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyQuote;
use App\Models\ContactMessage;
use App\Models\Review;
use App\Models\TravelPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/content', [
            'posts' => TravelPost::latest()->get(),
            'reviews' => Review::latest()->get(),
            'quotes' => CompanyQuote::latest()->get(),
            'contacts' => ContactMessage::latest()->get(),
        ]);
    }

    public function storePost(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', 'in:upcoming,past,promotion,offer,combo'],
            'destination' => ['nullable', 'string', 'max:180'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:51200'],
        ]);

        $data['slug'] = Str::slug($data['title']).'-'.Str::lower(Str::random(5));
        $data['is_published'] = $request->boolean('is_published');
        $data['published_at'] = $data['is_published'] ? now() : null;
        $data['cover_image_path'] = $request->hasFile('cover_image')
            ? $request->file('cover_image')->store('travel/images', 'public')
            : null;
        $data['video_path'] = $request->hasFile('video_file')
            ? $request->file('video_file')->store('travel/videos', 'public')
            : null;
        unset($data['cover_image'], $data['video_file']);

        TravelPost::create($data);

        return back()->with('success', 'El viaje se publicó correctamente.');
    }

    public function destroyPost(TravelPost $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'La publicación fue eliminada.');
    }

    public function storeReview(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'author_name' => ['required', 'string', 'max:120'],
            'destination' => ['nullable', 'string', 'max:180'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'content' => ['required', 'string', 'max:2000'],
            'is_published' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:51200'],
        ]);
        $data['is_published'] = $request->boolean('is_published');
        $data['photo_path'] = $request->hasFile('photo')
            ? $request->file('photo')->store('reviews/photos', 'public')
            : null;
        $data['video_path'] = $request->hasFile('video_file')
            ? $request->file('video_file')->store('reviews/videos', 'public')
            : null;
        unset($data['photo'], $data['video_file']);

        Review::create($data);

        return back()->with('success', 'La reseña fue guardada.');
    }

    public function destroyReview(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'La reseña fue eliminada.');
    }

    public function storeQuote(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'quote' => ['required', 'string', 'max:1000'],
            'author' => ['nullable', 'string', 'max:120'],
            'is_published' => ['boolean'],
        ]);
        $data['is_published'] = $request->boolean('is_published');
        CompanyQuote::create($data);

        return back()->with('success', 'La frase fue guardada.');
    }

    public function destroyQuote(CompanyQuote $quote): RedirectResponse
    {
        $quote->delete();

        return back()->with('success', 'La frase fue eliminada.');
    }

    public function markContactRead(ContactMessage $contact): RedirectResponse
    {
        $contact->update(['status' => 'read', 'read_at' => now()]);

        return back()->with('success', 'El mensaje fue marcado como leído.');
    }

    public function destroyContact(ContactMessage $contact): RedirectResponse
    {
        $contact->delete();

        return back()->with('success', 'El mensaje fue eliminado.');
    }
}
