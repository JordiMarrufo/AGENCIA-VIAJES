import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    Camera,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Film,
    MapPin,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import TravelCard from '@/components/public/travel-card';
import {
    categoryChip,
    categoryLabel,
    dateRangeLabel,
    formatDate,
    nightsLabel,
    priceLabel,
} from '@/lib/travel';
import type { TravelPostData } from '@/types/travel';
import '../../css/travel/detail.css';

type DetailProps = {
    post: TravelPostData;
    recommendedPosts: TravelPostData[];
};

export default function TravelDetail({ post, recommendedPosts }: DetailProps) {
    const photos = post.gallery_image_urls ?? [];
    const videos = post.gallery_video_urls ?? [];
    const [lightbox, setLightbox] = useState<number | null>(null);

    const price = priceLabel(post.price, post.currency);
    const range = dateRangeLabel(post.starts_at, post.ends_at);
    const nights = nightsLabel(post.starts_at, post.ends_at);
    const paragraphs = useMemo(
        () =>
            (post.content ?? '')
                .split(/\n{1,}/)
                .map((p) => p.trim())
                .filter(Boolean),
        [post.content],
    );
    const isRichContent = /<\/?[a-z][\s\S]*>/i.test(post.content ?? '');
    const plainLead = useMemo(() => {
        const text = (post.content ?? '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return text.length > 160 ? `${text.slice(0, 157)}…` : text;
    }, [post.content]);

    const openPhoto = (index: number) => setLightbox(index);

    const stepPhoto = (dir: 1 | -1) => {
        if (lightbox === null || photos.length === 0) {
            return;
        }
        setLightbox((lightbox + dir + photos.length) % photos.length);
    };

    useEffect(() => {
        if (lightbox === null) {
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLightbox(null);
            }
            if (e.key === 'ArrowRight') {
                stepPhoto(1);
            }
            if (e.key === 'ArrowLeft') {
                stepPhoto(-1);
            }
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox]);

    return (
        <>
            <Head title={post.title} />

            {/* PORTADA DEL VIAJE */}
            <section className="pd-hero" aria-label={post.title}>
                {post.cover_image_url && (
                    <img
                        className="pd-hero__bg"
                        src={post.cover_image_url}
                        alt={post.title}
                        aria-hidden="true"
                    />
                )}
                <div className="pd-hero__shade" aria-hidden="true" />
                <div className="tv-container">
                    <div className="pd-hero__content">
                        <nav className="pd-crumb" aria-label="Ruta de navegación">
                            <Link href="/">Inicio</Link>
                            <span aria-hidden="true">/</span>
                            <Link href="/viajes">Viajes</Link>
                            <span aria-hidden="true">/</span>
                            <span className="pd-crumb__current">{post.title}</span>
                        </nav>
                        <span className={`tv-chip ${categoryChip(post.category)}`}>
                            {categoryLabel(post.category)}
                        </span>
                        {post.destination && (
                            <p className="pd-hero__place">
                                <MapPin size={18} aria-hidden="true" />
                                {post.destination}
                            </p>
                        )}
                        <h1>{post.title}</h1>
                        <p className="pd-hero__excerpt">{post.excerpt || plainLead}</p>
                        <div className="pd-hero__facts">
                            {range && (
                                <span>
                                    <Calendar size={16} aria-hidden="true" />
                                    {range}
                                </span>
                            )}
                            {nights && (
                                <span>
                                    <Clock size={16} aria-hidden="true" />
                                    {nights}
                                </span>
                            )}
                            {price && (
                                <span>
                                    <Zap size={16} aria-hidden="true" />
                                    {price}
                                </span>
                            )}
                        </div>
                        <div className="pd-hero__actions">
                            <a href="/viajes#contacto" className="tv-btn tv-btn--magenta">
                                Quiero reservar este viaje
                                <ArrowRight size={17} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* DETALLE DEL VIAJE */}
            <section className="pd-main">
                <div className="tv-container pd-main__grid">
                    <article className="pd-about">
                        <p className="tv-eyebrow">Sobre este viaje</p>
                        <h2 className="tv-title">Una experiencia para recordar</h2>
                        <div
                            className={`pd-about__text${isRichContent ? ' pd-about__rich' : ''}`}
                        >
                            {isRichContent ? (
                                // Contenido curado por el equipo (formato HTML del editor).
                                // eslint-disable-next-line react/no-danger
                                <div
                                    dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                                />
                            ) : paragraphs.length > 0 ? (
                                paragraphs.map((paragraph, index) => (
                                    <p key={`${post.id}-p-${index}`}>{paragraph}</p>
                                ))
                            ) : (
                                <p>Próximamente te contaremos todos los detalles de este viaje.</p>
                            )}
                        </div>
                    </article>

                    <aside className="pd-facts" aria-label="Datos del viaje">
                        <h3>Datos del viaje</h3>
                        <dl>
                            {post.destination && (
                                <>
                                    <dt>Destino</dt>
                                    <dd>{post.destination}</dd>
                                </>
                            )}
                            <dt>Categoría</dt>
                            <dd>{categoryLabel(post.category)}</dd>
                            {range && (
                                <>
                                    <dt>Fechas</dt>
                                    <dd>{range}</dd>
                                </>
                            )}
                            {nights && (
                                <>
                                    <dt>Duración</dt>
                                    <dd>{nights}</dd>
                                </>
                            )}
                            {price && (
                                <>
                                    <dt>Precio por persona</dt>
                                    <dd className="pd-facts__price">{price}</dd>
                                </>
                            )}
                        </dl>
                    </aside>
                </div>
            </section>

            {/* GALERÍA DE FOTOS */}
            {photos.length > 0 && (
                <section className="pd-gallery" aria-labelledby="pd-gallery-title">
                    <div className="tv-container">
                        <header className="tv-section-head">
                            <div>
                                <p className="tv-eyebrow">Galería</p>
                                <h2 className="tv-title" id="pd-gallery-title">
                                    Así se ve el destino
                                </h2>
                                <p className="tv-lead">
                                    Haz clic en cualquier foto para verla en grande.
                                </p>
                            </div>
                            <span className="pd-gallery__count">
                                <Camera size={16} aria-hidden="true" />
                                {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                            </span>
                        </header>

                        <ul className="pd-mosaic">
                            {photos.map((photo, index) => (
                                <li key={photo} className="pd-mosaic__item">
                                    <button
                                        type="button"
                                        className="pd-mosaic__btn"
                                        onClick={() => openPhoto(index)}
                                        aria-label={`Ver foto ${index + 1} de ${photos.length}: ${post.title}`}
                                    >
                                        <img src={photo} alt={`${post.title} — foto ${index + 1}`} />
                                        <span className="pd-mosaic__zoom" aria-hidden="true">
                                            <Camera size={20} />
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {/* VIDEOS */}
            {videos.length > 0 && (
                <section className="pd-videos tv-section" aria-labelledby="pd-videos-title">
                    <div className="tv-container">
                        <header className="tv-section-head">
                            <div>
                                <p className="tv-eyebrow">Videos</p>
                                <h2 className="tv-title" id="pd-videos-title">
                                    El viaje en movimiento
                                </h2>
                            </div>
                            <span className="pd-gallery__count">
                                <Film size={16} aria-hidden="true" />
                                {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                            </span>
                        </header>
                        <div className="pd-videos__grid">
                            {videos.map((video, index) => (
                                <video
                                    key={video}
                                    src={video}
                                    controls
                                    preload="metadata"
                                    poster={post.cover_image_url ?? undefined}
                                    aria-label={`Video ${index + 1} de ${post.title}`}
                                >
                                    Tu navegador no puede reproducir este video.
                                </video>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* LLAMADA A LA ACCIÓN */}
            <section className="pd-cta" aria-label="Reservar">
                <div className="tv-container pd-cta__inner">
                    <div>
                        <p className="tv-eyebrow">¿Listo para viajar?</p>
                        <h2>No dejes pasar esta experiencia</h2>
                        <p>
                            Escríbenos y te ayudamos a armar tu viaje: fechas, hospedaje y
                            todos los detalles sin costo.
                        </p>
                        <ul className="pd-cta__checks">
                            <li>
                                <Check size={16} aria-hidden="true" />
                                Atención personalizada
                            </li>
                            <li>
                                <Check size={16} aria-hidden="true" />
                                Mejor precio garantizado
                            </li>
                        </ul>
                    </div>
                    <a href="/viajes#contacto" className="tv-btn pd-cta__btn">
                        Contáctanos ahora
                        <ArrowRight size={17} aria-hidden="true" />
                    </a>
                </div>
            </section>

            {/* OTROS VIAJES */}
            {recommendedPosts.length > 0 && (
                <section className="tv-section pd-related" aria-labelledby="pd-related-title">
                    <div className="tv-container">
                        <header className="tv-section-head">
                            <div>
                                <p className="tv-eyebrow">Te puede interesar</p>
                                <h2 className="tv-title" id="pd-related-title">
                                    Otros viajes para ti
                                </h2>
                            </div>
                            <Link href="/viajes" className="tv-link-more">
                                Ver todos los viajes
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </header>
                        <div className="pg-grid">
                            {recommendedPosts.map((post) => (
                                <TravelCard post={post} key={post.id} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* LIGHTBOX */}
            {lightbox !== null && photos[lightbox] && (
                <div
                    className="pd-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Foto ${lightbox + 1} de ${photos.length}`}
                    onClick={() => setLightbox(null)}
                >
                    <button
                        type="button"
                        className="pd-lightbox__close"
                        aria-label="Cerrar galería"
                        onClick={() => setLightbox(null)}
                    >
                        <X size={24} aria-hidden="true" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="pd-lightbox__nav pd-lightbox__nav--prev"
                                aria-label="Foto anterior"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    stepPhoto(-1);
                                }}
                            >
                                <ChevronLeft size={28} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="pd-lightbox__nav pd-lightbox__nav--next"
                                aria-label="Foto siguiente"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    stepPhoto(1);
                                }}
                            >
                                <ChevronRight size={28} aria-hidden="true" />
                            </button>
                        </>
                    )}

                    <figure
                        className="pd-lightbox__figure"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={photos[lightbox]} alt={`${post.title} — foto ${lightbox + 1}`} />
                        <figcaption>
                            {post.destination ? `${post.destination} · ` : ''}
                            {post.title} — {lightbox + 1} / {photos.length}
                        </figcaption>
                    </figure>
                </div>
            )}
        </>
    );
}
