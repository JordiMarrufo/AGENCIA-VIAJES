import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, MapPin, Plane } from 'lucide-react';
import type { TravelPostData } from '@/types/travel';
import {
    categoryChip,
    categoryLabel,
    categoryTile,
    dateRangeLabel,
    nightsLabel,
    priceLabel,
    travelDetailPath,
} from '@/lib/travel';

type Props = {
    post: TravelPostData;
    linkHref?: string;
    linkLabel?: string;
};

export default function TravelCard({
    post,
    linkHref = travelDetailPath(post),
    linkLabel = 'Ver viaje',
}: Props) {
    const price = priceLabel(post.price, post.currency);
    const range = dateRangeLabel(post.starts_at, post.ends_at);
    const nights = nightsLabel(post.starts_at, post.ends_at);
    const showPrice = Number(post.price ?? 0) > 0;

    return (
        <article className="tcard">
            <Link href={linkHref} className="tcard__media" tabIndex={-1} aria-hidden="true">
                {post.cover_image_url ? (
                    <img src={post.cover_image_url} alt={post.title} loading="lazy" />
                ) : (
                    <div className={`tcard__media-empty ${categoryTile(post.category)}`}>
                        <Plane size={40} aria-hidden="true" />
                    </div>
                )}
                <span className={`tv-chip ${categoryChip(post.category)} tcard__badge`}>
                    {categoryLabel(post.category)}
                </span>
                {nights && (
                    <span className="tcard__days">
                        <Calendar size={14} aria-hidden="true" />
                        {nights}
                    </span>
                )}
            </Link>

            <div className="tcard__body">
                <Link href={linkHref} className="tcard__title">
                    {post.destination && (
                        <span className="tcard__kicker">
                            <MapPin size={15} aria-hidden="true" />
                            {post.destination}
                        </span>
                    )}
                    <h3>{post.title}</h3>
                </Link>
                <p>{post.excerpt || post.content}</p>
                {range && (
                    <div className="tcard__meta">
                        <Calendar size={15} aria-hidden="true" />
                        <span>{range}</span>
                    </div>
                )}
                <div className="tcard__foot">
                    {showPrice && (
                        <div className="tcard__price">
                            <small>Precio por persona</small>
                            {price}
                        </div>
                    )}
                    <Link href={linkHref} className="tcard__link">
                        {linkLabel}
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
