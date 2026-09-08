import { Head, Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from 'lucide-react';
import { useRef } from 'react';
import TravelCard from '@/components/public/travel-card';
import { categoryChip, categoryLabel, categoryTile, formatDate, travelDetailPath } from '@/lib/travel';
import type { TravelPostData } from '@/types/travel';
import '../../css/travel/home.css';

type HeroData = {
    subtitle: string;
    image_url: string | null;
};

type HomeProps = {
    upcomingPosts: TravelPostData[];
    pastPosts: TravelPostData[];
    hero?: HeroData;
};

const FALLBACK_HERO_SUB = 'Experiencias entre playas, ríos, mares y bosques, diseñadas para que solo te preocupes de disfrutar cada destino.';

export default function Home({ upcomingPosts, pastPosts, hero }: HomeProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const heroImage = hero?.image_url ?? upcomingPosts[0]?.cover_image_url ?? null;
    const heroSub = hero?.subtitle?.trim() || FALLBACK_HERO_SUB;

    const scrollCarousel = (direction: 1 | -1) => {
        const track = scrollerRef.current;
        if (!track) {
            return;
        }
        const step = (track.firstElementChild?.clientWidth ?? 360) + 24;
        track.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Inicio" />

            {/* HERO */}
            <section className="pv-hero" aria-label="Bienvenida">
                {heroImage && (
                    <img
                        className="pv-hero__bg"
                        src={heroImage}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                <div className="pv-hero__shade" aria-hidden="true" />
                <div className="tv-container pv-hero__content">
                    <p className="pv-hero__eyebrow">Tu próxima aventura comienza aquí</p>
                    <h1 className="pv-hero__title">
                        Descubre el mundo, <span className="accent">viaja contigo mismo</span>
                    </h1>
                    <p className="pv-hero__sub">{heroSub}</p>
                    <div className="pv-hero__actions">
                        <a href="#proximos" className="tv-btn tv-btn--magenta">
                            Ver próximos viajes
                            <ArrowRight size={17} aria-hidden="true" />
                        </a>
                        <a href="#anteriores" className="tv-btn tv-btn--outline">
                            Nuestras experiencias
                        </a>
                    </div>
                </div>
                <a className="pv-hero__scroll" href="#proximos">
                    Descubre
                    <ArrowDown size={18} aria-hidden="true" />
                </a>
            </section>

            {/* PRÓXIMOS VIAJES */}
            <section className="tv-section" id="proximos">
                <div className="tv-container">
                    <div className="tv-section-head">
                        <div>
                            <p className="tv-eyebrow">Próximos viajes</p>
                            <h2 className="tv-title">Destinos que te están esperando</h2>
                            <p className="tv-lead">
                                Salidas próximas, promociones y ofertas para planear con
                                tiempo tu siguiente escapada.
                            </p>
                        </div>
                        <div className="tv-section-head__aside pv-carousel__tools">
                            <button
                                type="button"
                                className="pv-arrow"
                                aria-label="Viajes anteriores en el carrusel"
                                onClick={() => scrollCarousel(-1)}
                            >
                                <ChevronLeft size={20} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="pv-arrow"
                                aria-label="Más viajes en el carrusel"
                                onClick={() => scrollCarousel(1)}
                            >
                                <ChevronRight size={20} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>

                {upcomingPosts.length ? (
                    <div className="pv-scroller" ref={scrollerRef} tabIndex={0}>
                        {upcomingPosts.map((post) => (
                            <div className="pv-scroller__item" key={post.id}>
                                <TravelCard post={post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="tv-container">
                        <p className="tv-empty">
                            Estamos preparando nuestros próximos destinos. Escríbenos para
                            recibir las primeras fechas disponibles.
                        </p>
                    </div>
                )}
            </section>

            {/* VIAJES ANTERIORES — MOSAICO */}
            <section className="tv-section tv-section--soft" id="anteriores">
                <div className="tv-container">
                    <div className="tv-section-head">
                        <div>
                            <p className="tv-eyebrow">Viajes anteriores</p>
                            <h2 className="tv-title">Experiencias que ya vivimos</h2>
                            <p className="tv-lead">
                                Recorridos que nuestros viajeros ya disfrutaron. Cada
                                mosaico es una historia lista para repetirse.
                            </p>
                        </div>
                        <div className="tv-section-head__aside">
                            <Link href="/viajes" className="tv-link-more">
                                Ver todos los viajes
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                    </div>

                    {pastPosts.length ? (
                        <div className="pv-mosaic">
                            {pastPosts.map((post, index) => (
                                <Link
                                    key={post.id}
                                    href={travelDetailPath(post)}
                                    className={`pv-mosaic__tile pv-tile${index === 0 ? ' pv-tile--big' : ''}`}
                                >
                                    {post.cover_image_url ? (
                                        <img
                                            src={post.cover_image_url}
                                            alt={post.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span
                                            className={`pv-tile__fallback ${categoryTile(post.category)}`}
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="pv-tile__shade" aria-hidden="true" />
                                    <span className={`tv-chip ${categoryChip(post.category)} pv-tile__chip`}>
                                        {categoryLabel(post.category)}
                                    </span>
                                    <span className="pv-tile__inner">
                                        <strong>{post.title}</strong>
                                        {post.destination && (
                                            <small>
                                                <MapPin size={14} aria-hidden="true" />
                                                {post.destination}
                                                {post.starts_at && ` · ${formatDate(post.starts_at).slice(-4)}`}
                                            </small>
                                        )}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="tv-empty">
                            Pronto compartiremos los mosaicos de nuestros viajes anteriores.
                        </p>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="tv-section pv-banner">
                <div className="tv-container">
                    <div className="pv-banner__panel">
                        <div>
                            <h2>¿No encuentras tu próximo destino?</h2>
                            <p>
                                Cuéntanos qué tipo de viaje imaginas y armaremos una
                                propuesta a tu medida, sin compromiso.
                            </p>
                        </div>
                        <Link href="/viajes#contacto" className="tv-btn tv-btn--magenta">
                            Escribirnos
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
