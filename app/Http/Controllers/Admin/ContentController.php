<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyQuote;
use App\Models\ContactMessage;
use App\Models\Review;
use App\Models\TravelPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $this->validateGalleryFiles($request, 'photos_order', 'gallery_photo_', 'image');
        $this->validateGalleryFiles($request, 'videos_order', 'gallery_video_', 'video');

        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', 'in:upcoming,past,promotion,offer'],
            'destination' => ['nullable', 'string', 'max:180'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'photos_order' => ['nullable', 'string'],
            'videos_order' => ['nullable', 'string'],
        ]);

        $data['slug'] = Str::slug($data['title']).'-'.Str::lower(Str::random(5));
        $data['is_published'] = $request->boolean('is_published');
        $data['published_at'] = $data['is_published'] ? now() : null;
        $data['cover_image_path'] = $this->storeUpload($request, 'cover_image', 'travel/images');
        $data['gallery_paths'] = $this->resolveOrderedFiles($request, 'photos_order', 'gallery_photo_', 'travel/images', []);
        $data['gallery_video_paths'] = $this->resolveOrderedFiles($request, 'videos_order', 'gallery_video_', 'travel/videos', []);
        unset($data['cover_image'], $data['photos_order'], $data['videos_order']);

        TravelPost::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Viaje creado correctamente.']);

        return back();
    }

    public function updatePost(Request $request, TravelPost $post): RedirectResponse
    {
        $this->validateGalleryFiles($request, 'photos_order', 'gallery_photo_', 'image');
        $this->validateGalleryFiles($request, 'videos_order', 'gallery_video_', 'video');

        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', 'in:upcoming,past,promotion,offer'],
            'destination' => ['nullable', 'string', 'max:180'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'is_published' => ['boolean'],
            'cover_image' => ['nullable', 'image', 'max:5120'],
            'photos_order' => ['nullable', 'string'],
            'videos_order' => ['nullable', 'string'],
        ]);

        $data['is_published'] = $request->boolean('is_published');
        $data['published_at'] = $data['is_published']
            ? ($post->published_at ?? now())
            : null;

        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $this->storeUpload($request, 'cover_image', 'travel/images');
        }

        $oldPhotos = $post->gallery_paths ?? [];
        $oldVideos = $post->gallery_video_paths ?? [];
        $data['gallery_paths'] = $this->resolveOrderedFiles($request, 'photos_order', 'gallery_photo_', 'travel/images', $oldPhotos);
        $data['gallery_video_paths'] = $this->resolveOrderedFiles($request, 'videos_order', 'gallery_video_', 'travel/videos', $oldVideos);
        unset($data['cover_image'], $data['photos_order'], $data['videos_order']);

        $post->update($data);

        $this->deleteRemovedFiles($oldPhotos, $data['gallery_paths']);
        $this->deleteRemovedFiles($oldVideos, $data['gallery_video_paths']);

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
        $this->deletePostMedia($post);

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

    /**
     * Valida los archivos nuevos que el formulario adjunta bajo campos
     * dinámicos (gallery_photo_<key> / gallery_video_<key>) según el orden.
     */
    private function validateGalleryFiles(Request $request, string $orderField, string $fieldPrefix, string $kind): void
    {
        $order = $this->decodeOrder($request->input($orderField));
        $rules = [];

        foreach ($order as $token) {
            if (! is_string($token) || ! str_starts_with(trim($token), 'new:')) {
                continue;
            }
            $field = $fieldPrefix.substr(trim($token), 4);
            if (! $request->hasFile($field)) {
                continue;
            }
            $rules[$field] = $kind === 'image'
                ? ['required', 'image', 'max:5120']
                : ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:51200'];
        }

        if ($rules !== []) {
            $request->validate($rules);
        }
    }

    /**
     * Convierte el orden de la galería (tokens stored:…/new:…) en rutas
     * guardadas. Los nuevos se suben a disco y los conservados se mantienen.
     *
     * @param  list<string>  $existing
     * @return list<string>
     */
    private function resolveOrderedFiles(Request $request, string $orderField, string $fieldPrefix, string $folder, array $existing): array
    {
        // Sin campo de orden (cliente antiguo) se conserva lo guardado; un
        // orden vacío explícito ([]) significa que el usuario borró la galería.
        $raw = $request->input($orderField);
        if ($raw === null) {
            return $existing;
        }
        $order = $this->decodeOrder($raw);
        if ($order === []) {
            return [];
        }

        $resolved = [];
        foreach ($order as $token) {
            if (! is_string($token)) {
                continue;
            }
            $token = trim($token);
            if ($token === '') {
                continue;
            }

            if (str_starts_with($token, 'new:')) {
                $file = $request->file($fieldPrefix.substr($token, 4));
                if ($file !== null && $file->isValid()) {
                    $resolved[] = $file->store($folder, 'public');
                }

                continue;
            }

            $url = str_starts_with($token, 'stored:') ? substr($token, 7) : $token;
            $path = $this->storagePathFromUrl($url);
            if ($path !== null && (in_array($path, $existing, true) || Storage::disk('public')->exists($path))) {
                $resolved[] = $path;
            }
        }

        return array_values(array_unique($resolved));
    }

    /**
     * @return list<string>
     */
    private function decodeOrder(mixed $raw): array
    {
        if (! is_string($raw)) {
            return [];
        }
        $decoded = json_decode($raw, true);

        return is_array($decoded) ? array_values($decoded) : [];
    }

    private function storagePathFromUrl(string $url): ?string
    {
        $marker = '/storage/';
        $pos = strpos($url, $marker);

        return $pos === false ? null : substr($url, $pos + strlen($marker));
    }

    /**
     * Borra archivos de galería que dejaron de estar en el orden guardado,
     * siempre que no los use otra publicación.
     *
     * @param  list<string>  $old
     * @param  list<string>  $kept
     */
    private function deleteRemovedFiles(array $old, array $kept): void
    {
        foreach (array_diff($old, $kept) as $path) {
            if (! $this->isPathInUse($path)) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    private function deletePostMedia(TravelPost $post): void
    {
        foreach (array_filter([$post->cover_image_path]) as $path) {
            if (! $this->isPathInUse($path)) {
                Storage::disk('public')->delete($path);
            }
        }
        $this->deleteRemovedFiles($post->gallery_paths ?? [], []);
        $this->deleteRemovedFiles($post->gallery_video_paths ?? [], []);
    }

    private function isPathInUse(string $path): bool
    {
        return TravelPost::query()
            ->where(function ($query) use ($path): void {
                $query->where('cover_image_path', $path)
                    ->orWhereJsonContains('gallery_paths', $path)
                    ->orWhereJsonContains('gallery_video_paths', $path);
            })
            ->exists();
    }
}
