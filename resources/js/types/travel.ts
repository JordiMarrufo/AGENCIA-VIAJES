export type TravelCategory =
    | 'upcoming'
    | 'past'
    | 'promotion'
    | 'offer';

export type TravelCurrency = 'usdt' | 'ves';

export type TravelPostData = {
    id: number;
    title: string;
    slug: string;
    category: TravelCategory;
    destination: string | null;
    excerpt: string | null;
    content: string;
    starts_at: string | null;
    ends_at: string | null;
    price: string | null;
    currency: TravelCurrency;
    cover_image_url: string | null;
    gallery_image_urls: string[];
    gallery_video_urls: string[];
};

export type ReviewData = {
    id: number;
    author_name: string;
    destination: string | null;
    rating: number;
    content: string;
    photo_url: string | null;
    video_url: string | null;
};

export type QuoteData = {
    id: number;
    quote: string;
    author: string | null;
};
