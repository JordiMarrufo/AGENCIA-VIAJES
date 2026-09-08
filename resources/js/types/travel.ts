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
