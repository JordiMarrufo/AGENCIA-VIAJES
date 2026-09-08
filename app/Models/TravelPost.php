<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'title', 'slug', 'category', 'destination', 'excerpt', 'content',
    'starts_at', 'ends_at', 'price', 'cover_image_path', 'video_path',
    'gallery_paths', 'is_published', 'published_at',
])]
class TravelPost extends Model
{
    protected $appends = ['cover_image_url'];

    protected function casts(): array
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',
            'price' => 'decimal:2',
            'gallery_paths' => 'array',
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
}
