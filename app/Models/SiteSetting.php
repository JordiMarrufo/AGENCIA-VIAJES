<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    public const DEFAULT_HERO_SUBTITLE = 'Experiencias entre playas, ríos, mares y bosques, diseñadas para que solo te preocupes de disfrutar cada destino.';

    public const DEFAULT_CONTACT_EMAIL = 'hola@agenciaviajes.com';

    public const DEFAULT_CONTACT_PHONE = '+52 55 0000 0000';

    public const DEFAULT_CONTACT_WHATSAPP = '+52 55 0000 0000';

    protected $fillable = [
        'site_name',
        'site_tagline',
        'site_logo_path',
        'hero_subtitle',
        'hero_image_path',
        'contact_email',
        'contact_phone',
        'contact_whatsapp',
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

    /**
     * Correo de contacto, con valor por defecto cuando está vacío.
     */
    public function getContactEmailAttribute(): string
    {
        return $this->filledValue('contact_email', static::DEFAULT_CONTACT_EMAIL);
    }

    /**
     * Teléfono de contacto, con valor por defecto cuando está vacío.
     */
    public function getContactPhoneAttribute(): string
    {
        return $this->filledValue('contact_phone', static::DEFAULT_CONTACT_PHONE);
    }

    /**
     * WhatsApp de contacto, con valor por defecto cuando está vacío.
     */
    public function getContactWhatsappAttribute(): string
    {
        return $this->filledValue('contact_whatsapp', static::DEFAULT_CONTACT_WHATSAPP);
    }

    /**
     * Devuelve el valor de una columna si no está vacía o el valor por defecto.
     */
    private function filledValue(string $column, string $default): string
    {
        $value = $this->attributes[$column] ?? null;

        return $value !== null && trim((string) $value) !== ''
            ? trim((string) $value)
            : $default;
    }
}
