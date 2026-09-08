<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'site_tagline',
        'site_logo_path',
    ];

    /**
     * Obtiene la fila única de configuración del sitio.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            ['site_name' => 'Agencia de Viajes', 'site_tagline' => 'Playa · Mar · Naturaleza'],
        );
    }

    /**
     * URL pública del logo del encabezado.
     */
    public function getLogoUrlAttribute(): ?string
    {
        return $this->site_logo_path
            ? Storage::disk('public')->url($this->site_logo_path)
            : null;
    }
}
