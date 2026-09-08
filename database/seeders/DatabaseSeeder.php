<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminPassword = env('ADMIN_PASSWORD');

        if (blank($adminPassword)) {
            throw new RuntimeException('Define ADMIN_PASSWORD before running the database seeder.');
        }

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@agenciaviajes.com')],
            [
                'name' => env('ADMIN_NAME', 'Administrador'),
                'password' => $adminPassword,
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );
    }
}
