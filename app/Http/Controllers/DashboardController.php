<?php

namespace App\Http\Controllers;

use App\Models\CompanyQuote;
use App\Models\ContactMessage;
use App\Models\Review;
use App\Models\TravelPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'posts' => TravelPost::count(),
                'postsUpcoming' => TravelPost::where('category', 'upcoming')->count(),
                'postsPast' => TravelPost::where('category', 'past')->count(),
                'postsPublished' => TravelPost::where('is_published', true)->count(),
                'reviews' => Review::count(),
                'reviewsPublished' => Review::where('is_published', true)->count(),
                'quotes' => CompanyQuote::count(),
                'contacts' => ContactMessage::count(),
                'contactsUnread' => ContactMessage::where('status', '!=', 'read')->count(),
            ],
            'isAdmin' => (bool) $request->user()->is_admin,
        ]);
    }
}
