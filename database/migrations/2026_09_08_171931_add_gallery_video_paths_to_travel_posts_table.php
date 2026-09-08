<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('travel_posts', function (Blueprint $table) {
            $table->json('gallery_video_paths')->nullable()->after('gallery_paths');
        });

        // Conserva el video promocional único anterior dentro de la galería nueva.
        DB::table('travel_posts')
            ->whereNotNull('video_path')
            ->get(['id', 'video_path'])
            ->each(function ($post): void {
                DB::table('travel_posts')
                    ->where('id', $post->id)
                    ->update(['gallery_video_paths' => json_encode([$post->video_path])]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('travel_posts', function (Blueprint $table) {
            $table->dropColumn('gallery_video_paths');
        });
    }
};
