<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('travel_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->string('destination')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('video_path')->nullable();
            $table->json('gallery_paths')->nullable();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travel_posts');
    }
};
