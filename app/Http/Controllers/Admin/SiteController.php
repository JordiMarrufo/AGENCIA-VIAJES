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
        ]);

        $settings = SiteSetting::current();

        if ($request->boolean('remove_logo') && ! $request->hasFile('logo')) {
            $this->deleteLogo($settings->site_logo_path);
            $data['site_logo_path'] = null;
        } elseif ($request->hasFile('logo')) {
            $this->deleteLogo($settings->site_logo_path);
            $data['site_logo_path'] = $request->file('logo')->store('site', 'public');
        }

        unset($data['logo'], $data['remove_logo']);

        $settings->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Ajustes del sitio guardados correctamente.']);

        return back();
    }

    private function deleteLogo(?string $path): void
    {
        if ($path !== null) {
            Storage::disk('public')->delete($path);
        }
    }
}
