export type TravelCategory =
    | 'upcoming'
    | 'past'
    | 'promotion'
    | 'offer'
    | 'combo';

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
};

export type QuoteData = {
    id: number;
    quote: string;
    author: string | null;
};
