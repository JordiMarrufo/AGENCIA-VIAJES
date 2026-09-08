<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    public const DEFAULT_HERO_SUBTITLE = 'Experiencias entre playas, ríos, mares y bosques, diseñadas para que solo te preocupes de disfrutar cada destino.';

    protected $fillable = [
        'site_name',
        'site_tagline',
        'site_logo_path',
        'hero_subtitle',
        'hero_image_path',
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

    /**
     * Subtítulo de la portada del inicio, con texto por defecto cuando está vacío.
     */
    public function getHeroSubtitleAttribute(): string
    {
        return $this->attributes['hero_subtitle'] !== null
            && trim($this->attributes['hero_subtitle']) !== ''
            ? trim($this->attributes['hero_subtitle'])
            : static::DEFAULT_HERO_SUBTITLE;
    }

    /**
     * URL pública de la imagen de fondo de la portada del inicio.
     */
    public function getHeroImageUrlAttribute(): ?string
    {
        return $this->hero_image_path
            ? Storage::disk('public')->url($this->hero_image_path)
            : null;
    }
}
