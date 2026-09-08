<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    /**
     * Muestra la página de ajustes del sitio (nombre, eslogan y logo).
     */
    public function edit(): Response
    {
        $settings = SiteSetting::current();

        return Inertia::render('admin/site', [
            'settings' => [
                'site_name' => $settings->site_name,
                'site_tagline' => $settings->site_tagline,
                'logo_url' => $settings->logo_url,
                'hero_subtitle' => $settings->hero_subtitle,
                'hero_image_url' => $settings->hero_image_url,
                'contact_email' => $settings->contact_email,
                'contact_phone' => $settings->contact_phone,
                'contact_whatsapp' => $settings->contact_whatsapp,
            ],
        ]);
    }

    /**
     * Guarda los ajustes del sitio.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:120'],
            'site_tagline' => ['nullable', 'string', 'max:180'],
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:5120'],
            'remove_logo' => ['sometimes', 'boolean'],
            'hero_subtitle' => ['nullable', 'string', 'max:500'],
            'hero_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:10240'],
            'remove_hero_image' => ['sometimes', 'boolean'],
            'contact_email' => ['nullable', 'string', 'email', 'max:180'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'contact_whatsapp' => ['nullable', 'string', 'max:40'],
        ]);

        $settings = SiteSetting::current();

        if ($request->boolean('remove_logo') && ! $request->hasFile('logo')) {
            $this->deleteStoredFile($settings->site_logo_path);
            $data['site_logo_path'] = null;
        } elseif ($request->hasFile('logo')) {
            $this->deleteStoredFile($settings->site_logo_path);
            $data['site_logo_path'] = $request->file('logo')->store('site', 'public');
        }

        if ($request->boolean('remove_hero_image') && ! $request->hasFile('hero_image')) {
            $this->deleteStoredFile($settings->hero_image_path);
            $data['hero_image_path'] = null;
        } elseif ($request->hasFile('hero_image')) {
            $this->deleteStoredFile($settings->hero_image_path);
            $data['hero_image_path'] = $request->file('hero_image')->store('site', 'public');
        }

        $data['hero_subtitle'] = $request->filled('hero_subtitle')
            ? trim((string) $request->input('hero_subtitle'))
            : null;

        foreach (['contact_email', 'contact_phone', 'contact_whatsapp'] as $field) {
            $data[$field] = $request->filled($field)
                ? trim((string) $request->input($field))
                : null;
        }

        unset($data['logo'], $data['remove_logo'], $data['hero_image'], $data['remove_hero_image']);

        $settings->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ajustes del sitio guardados correctamente.']);

        return back();
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path !== null) {
            Storage::disk('public')->delete($path);
        }
    }
}
