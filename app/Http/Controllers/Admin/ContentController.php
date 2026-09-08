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
    public function posts(): Response
    {
        return Inertia::render('admin/posts', [
            'posts' => TravelPost::latest()->get(),
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
        $data['cover_image_path'] = $this->storeUpload($request, 'cover_image', 'travel/images');
        $data['video_path'] = $this->storeUpload($request, 'video_file', 'travel/videos');
        unset($data['cover_image'], $data['video_file']);

        TravelPost::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Viaje creado correctamente.']);

        return back();
    }

    public function updatePost(Request $request, TravelPost $post): RedirectResponse
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

        $data['is_published'] = $request->boolean('is_published');
        $data['published_at'] = $data['is_published']
            ? ($post->published_at ?? now())
            : null;

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->storeUpload($request, 'cover_image', 'travel/images');
        }
        if ($request->hasFile('video_file')) {
            $data['video_path'] = $this->storeUpload($request, 'video_file', 'travel/videos');
        }
        unset($data['cover_image'], $data['video_file']);

        $post->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Viaje actualizado correctamente.']);

        return back();
    }

    public function togglePost(TravelPost $post): RedirectResponse
    {
        $post->update([
            'is_published' => ! $post->is_published,
            'published_at' => $post->is_published ? $post->published_at : now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $post->is_published ? 'El viaje quedó publicado.' : 'El viaje quedó oculto.',
        ]);

        return back();
    }

    public function destroyPost(TravelPost $post): RedirectResponse
    {
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Viaje eliminado.']);

        return back();
    }

    public function reviews(): Response
    {
        return Inertia::render('admin/reviews', [
            'reviews' => Review::latest()->get(),
        ]);
    }

    public function storeReview(Request $request): RedirectResponse
    {
        $data = $this->validateReview($request);
        $data['is_published'] = $request->boolean('is_published');
        $data['photo_path'] = $this->storeUpload($request, 'photo', 'reviews/photos');
        $data['video_path'] = $this->storeUpload($request, 'video_file', 'reviews/videos');
        unset($data['photo'], $data['video_file']);

        Review::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Reseña creada correctamente.']);

        return back();
    }

    public function updateReview(Request $request, Review $review): RedirectResponse
    {
        $data = $this->validateReview($request);
        $data['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->storeUpload($request, 'photo', 'reviews/photos');
        }
        if ($request->hasFile('video_file')) {
            $data['video_path'] = $this->storeUpload($request, 'video_file', 'reviews/videos');
        }
        unset($data['photo'], $data['video_file']);

        $review->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Reseña actualizada correctamente.']);

        return back();
    }

    public function toggleReview(Review $review): RedirectResponse
    {
        $review->update(['is_published' => ! $review->is_published]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $review->is_published ? 'La reseña quedó publicada.' : 'La reseña quedó oculta.',
        ]);

        return back();
    }

    public function destroyReview(Review $review): RedirectResponse
    {
        $review->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Reseña eliminada.']);

        return back();
    }

    public function quotes(): Response
    {
        return Inertia::render('admin/quotes', [
            'quotes' => CompanyQuote::latest()->get(),
        ]);
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

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Frase creada correctamente.']);

        return back();
    }

    public function updateQuote(Request $request, CompanyQuote $quote): RedirectResponse
    {
        $data = $request->validate([
            'quote' => ['required', 'string', 'max:1000'],
            'author' => ['nullable', 'string', 'max:120'],
            'is_published' => ['boolean'],
        ]);
        $data['is_published'] = $request->boolean('is_published');
        $quote->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Frase actualizada correctamente.']);

        return back();
    }

    public function toggleQuote(CompanyQuote $quote): RedirectResponse
    {
        $quote->update(['is_published' => ! $quote->is_published]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $quote->is_published ? 'La frase quedó publicada.' : 'La frase quedó oculta.',
        ]);

        return back();
    }

    public function destroyQuote(CompanyQuote $quote): RedirectResponse
    {
        $quote->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Frase eliminada.']);

        return back();
    }

    public function contacts(): Response
    {
        return Inertia::render('admin/contacts', [
            'contacts' => ContactMessage::latest()->get(),
        ]);
    }

    public function markContactRead(ContactMessage $contact): RedirectResponse
    {
        $contact->update(['status' => 'read', 'read_at' => now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mensaje marcado como leído.']);

        return back();
    }

    public function destroyContact(ContactMessage $contact): RedirectResponse
    {
        $contact->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Mensaje eliminado.']);

        return back();
    }

    /**
     * @return array{author_name: string, destination?: string, rating: int, content: string}
     */
    private function validateReview(Request $request): array
    {
        return $request->validate([
            'author_name' => ['required', 'string', 'max:120'],
            'destination' => ['nullable', 'string', 'max:180'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'content' => ['required', 'string', 'max:2000'],
            'is_published' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:51200'],
        ]);
    }

    private function storeUpload(Request $request, string $field, string $folder): ?string
    {
        return $request->hasFile($field)
            ? $request->file($field)->store($folder, 'public')
            : null;
    }
}
