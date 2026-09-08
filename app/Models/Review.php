<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['author_name', 'destination', 'rating', 'content', 'photo_path', 'video_path', 'is_published'])]
class Review extends Model
{
    protected $appends = ['photo_url', 'video_url'];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    protected function photoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->photo_path
            ? asset('storage/'.$this->photo_path)
            : null);
    }

    protected function videoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->video_path
            ? asset('storage/'.$this->video_path)
            : null);
    }
}
