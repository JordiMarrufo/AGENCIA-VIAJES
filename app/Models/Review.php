<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['author_name', 'destination', 'rating', 'content', 'photo_path', 'video_path', 'is_published'])]
class Review extends Model
{
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_published' => 'boolean',
        ];
    }
}
