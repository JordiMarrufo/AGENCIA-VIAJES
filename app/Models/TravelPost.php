<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title', 'slug', 'category', 'destination', 'excerpt', 'content',
    'starts_at', 'ends_at', 'price', 'currency', 'cover_image_path', 'video_path',
    'gallery_paths', 'gallery_video_paths', 'is_published', 'published_at',
])]
class TravelPost extends Model
{
    protected $appends = ['cover_image_url', 'gallery_image_urls', 'gallery_video_urls'];

    protected function casts(): array
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',
            'price' => 'decimal:2',
            'gallery_paths' => 'array',
            'gallery_video_paths' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected function coverImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->cover_image_path
            ? asset('storage/'.$this->cover_image_path)
            : null);
    }

    /**
     * URLs completas de la galería de fotos: la portada primero y luego las
     * imágenes adicionales, en el orden guardado.
     */
    protected function galleryImageUrls(): Attribute
    {
        return Attribute::get(function (): array {
            $paths = array_merge(
                $this->cover_image_path ? [$this->cover_image_path] : [],
                $this->gallery_paths ?? [],
            );

            return array_map(
                fn (string $path): string => asset('storage/'.$path),
                array_values(array_unique($paths)),
            );
        });
    }

    protected function galleryVideoUrls(): Attribute
    {
        return Attribute::get(fn (): array => array_map(
            fn (string $path): string => asset('storage/'.$path),
            array_values(array_unique($this->gallery_video_paths ?? [])),
        ));
    }
}
