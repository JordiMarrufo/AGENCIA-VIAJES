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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Agencia de Viajes');
            $table->string('site_tagline')->default('Playa · Mar · Naturaleza');
            $table->string('site_logo_path')->nullable();
            $table->timestamps();
        });

        DB::table('site_settings')->insert([
            'site_name' => 'Agencia de Viajes',
            'site_tagline' => 'Playa · Mar · Naturaleza',
            'site_logo_path' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
