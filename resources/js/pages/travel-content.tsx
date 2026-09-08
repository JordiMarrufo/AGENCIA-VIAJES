import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowDown,
    CheckCircle2,
    Mail,
    MapPin,
    Phone,
    Quote,
    Send,
    Star,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import TravelCard from '@/components/public/travel-card';
import type { QuoteData, ReviewData, TravelPostData } from '@/types/travel';
import '../../css/travel/listing.css';

type TravelContentProps = {
    posts: TravelPostData[];
    reviews: ReviewData[];
    quotes: QuoteData[];
    contact: {
        email: string;
        phone: string;
        whatsapp: string;
    };
};

function WhatsAppIcon({ size = 18 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 448 512"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
    );
}

export default function TravelContent({ posts, reviews, quotes, contact }: TravelContentProps) {
    const form = useForm({ name: '', email: '', phone: '', message: '' });
    const [sent, setSent] = useState(false);

    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/contacto', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setSent(true);
            },
        });
    }

    return (
        <>
            <Head title="Viajes y experiencias" />

            <main>
                {/* CABECERA */}
                <section className="pg-hero">
                    <div className="tv-container pg-hero__inner">
                        <p className="tv-eyebrow">Nuestros viajes</p>
                        <h1>Viaja, descubre y crea recuerdos</h1>
                        <p className="pg-hero__lead">
                            Destinos entre playas, ríos, mares y bosques. Promociones,
                            salidas grupales y experiencias a tu medida, siempre con el
                            acompañamiento de un equipo que conoce cada rincón.
                        </p>
                        <div className="pg-hero__anchors">
                            <a className="tv-chip tv-chip--mar" href="#destinos">
                                Ver viajes
                            </a>
                            <a className="tv-chip tv-chip--rio" href="#resenas">
                                Reseñas
                            </a>
                            <a className="tv-chip tv-chip--magenta" href="#contacto">
                                Pedir información
                            </a>
                        </div>
                    </div>
                </section>

                {/* VIAJES */}
                <section className="tv-section" id="destinos">
                    <div className="tv-container">
                        <div className="tv-section-head">
                            <div>
                                <p className="tv-eyebrow">Viajes y promociones</p>
                                <h2 className="tv-title">Explora nuestras experiencias</h2>
                                <p className="tv-lead">
                                    Cada salida incluye hospedaje, traslados y una agenda
                                    pensada para que disfrutes sin preocuparte por nada.
                                </p>
                            </div>
                            <div className="tv-section-head__aside">
                                <a className="tv-link-more" href="#contacto">
                                    <ArrowDown size={16} aria-hidden="true" />
                                    Solicitar más fechas
                                </a>
                            </div>
                        </div>

                        {posts.length ? (
                            <div className="pg-grid">
                                {posts.map((post) => (
                                    <TravelCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <p className="tv-empty">
                                Estamos preparando nuestros próximos destinos. Escríbenos
                                para recibir las primeras fechas y promociones disponibles.
                            </p>
                        )}
                    </div>
                </section>

                {/* RESEÑAS */}
                <section className="tv-section tv-section--soft" id="resenas">
                    <div className="tv-container">
                        <div className="tv-section-head">
                            <div>
                                <p className="tv-eyebrow">Reseñas</p>
                                <h2 className="tv-title">Lo que dicen nuestros viajeros</h2>
                                <p className="tv-lead">
                                    Experiencias reales de quienes ya viajaron con la
                                    agencia.
                                </p>
                            </div>
                        </div>

                        {reviews.length ? (
                            <div className="tv-reviews">
                                {reviews.map((review) => (
                                    <article
                                        className={
                                            review.photo_url || review.video_url
                                                ? 'tv-review tv-review--media'
                                                : 'tv-review'
                                        }
                                        key={review.id}
                                    >
                                        {review.photo_url && !review.video_url && (
                                            <figure className="tv-review__media">
                                                <img
                                                    src={review.photo_url}
                                                    alt={`${review.destination ? `${review.destination} · ` : ''}foto compartida por ${review.author_name}`}
                                                    loading="lazy"
                                                />
                                            </figure>
                                        )}

                                        {review.video_url && (
                                            <figure className="tv-review__media tv-review__media--video">
                                                <video
                                                    src={review.video_url}
                                                    poster={review.photo_url ?? undefined}
                                                    controls
                                                    preload="metadata"
                                                />
                                            </figure>
                                        )}

                                        <div className="tv-review__stars" role="img" aria-label={`${review.rating} de 5 estrellas`}>
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} size={15} fill="currentColor" aria-hidden="true" />
                                            ))}
                                            <span>{review.rating} de 5</span>
                                        </div>
                                        <p className="tv-review__body">“{review.content}”</p>
                                        <footer className="tv-review__author">
                                            <strong>{review.author_name}</strong>
                                            {review.destination && (
                                                <span>
                                                    <MapPin size={13} aria-hidden="true" />
                                                    {review.destination}
                                                </span>
                                            )}
                                        </footer>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="tv-empty">
                                Muy pronto compartiremos las experiencias de nuestros
                                viajeros.
                            </p>
                        )}

                        {quotes.length > 0 && (
                            <div className="tv-quotes" style={{ marginTop: '3.2rem' }}>
                                {quotes.map((quote) => (
                                    <div className="tv-quote" key={quote.id}>
                                        <span className="tv-quote__mark">
                                            <Quote size={22} aria-hidden="true" />
                                        </span>
                                        <blockquote>“{quote.quote}”</blockquote>
                                        {quote.author && <cite>{quote.author}</cite>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CONTACTO */}
                <section className="tv-section pg-contact" id="contacto">
                    <div className="tv-container">
                        <div className="pg-contact__panel">
                            <div className="pg-contact__info">
                                <p className="tv-eyebrow">Contacto</p>
                                <h2>¿Listo para tu próximo viaje?</h2>
                                <p>
                                    Cuéntanos a dónde quieres ir, con quién y en qué fechas.
                                    Armaremos una propuesta sin compromiso en menos de 24
                                    horas.
                                </p>
                                <ul className="pg-contact__list">
                                    <li>
                                        <CheckCircle2 size={18} aria-hidden="true" />
                                        Respuesta rápida, en menos de 24 horas
                                    </li>
                                    <li>
                                        <CheckCircle2 size={18} aria-hidden="true" />
                                        Asesoría personalizada, sin costo
                                    </li>
                                    <li>
                                        <CheckCircle2 size={18} aria-hidden="true" />
                                        Precios claros, sin cargos ocultos
                                    </li>
                                </ul>
                            </div>

                            <div className="pg-contact__card">
                                <h3>Envíanos tu consulta</h3>
                                <p>Completa el formulario y te contactaremos pronto.</p>
                                <form className="tv-form" onSubmit={submit} noValidate>
                                    <div className={`tv-field${form.errors.name ? ' tv-field--error' : ''}`}>
                                        <label htmlFor="c-name">Nombre completo</label>
                                        <input
                                            id="c-name"
                                            name="name"
                                            placeholder="Tu nombre"
                                            value={form.data.name}
                                            onChange={(e) => form.setData('name', e.target.value)}
                                            required
                                        />
                                        {form.errors.name && (
                                            <p className="tv-field__error">{form.errors.name}</p>
                                        )}
                                    </div>
                                    <div className={`tv-field${form.errors.email ? ' tv-field--error' : ''}`}>
                                        <label htmlFor="c-email">Correo electrónico</label>
                                        <input
                                            id="c-email"
                                            name="email"
                                            type="email"
                                            placeholder="tucorreo@ejemplo.com"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            required
                                        />
                                        {form.errors.email && (
                                            <p className="tv-field__error">{form.errors.email}</p>
                                        )}
                                    </div>
                                    <div className={`tv-field${form.errors.phone ? ' tv-field--error' : ''}`}>
                                        <label htmlFor="c-phone">Teléfono (opcional)</label>
                                        <input
                                            id="c-phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+52 ..."
                                            value={form.data.phone}
                                            onChange={(e) => form.setData('phone', e.target.value)}
                                        />
                                        {form.errors.phone && (
                                            <p className="tv-field__error">{form.errors.phone}</p>
                                        )}
                                    </div>
                                    <div className={`tv-field${form.errors.message ? ' tv-field--error' : ''}`}>
                                        <label htmlFor="c-message">Mensaje</label>
                                        <textarea
                                            id="c-message"
                                            name="message"
                                            rows={5}
                                            placeholder="Cuéntanos a dónde quieres viajar..."
                                            value={form.data.message}
                                            onChange={(e) => form.setData('message', e.target.value)}
                                            required
                                        />
                                        {form.errors.message && (
                                            <p className="tv-field__error">{form.errors.message}</p>
                                        )}
                                    </div>
                                    {sent && (
                                        <p className="tv-form__status" role="status">
                                            ¡Gracias por escribirnos! Te responderemos muy pronto.
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        className="tv-btn tv-btn--magenta"
                                        disabled={form.processing}
                                    >
                                        {form.processing ? 'Enviando...' : 'Enviar mensaje'}
                                        <Send size={16} aria-hidden="true" />
                                    </button>
                                </form>
                                <div className="pg-contact__direct">
                                    <span className="pg-contact__direct-label">
                                        ¿Prefieres escribirnos directo?
                                    </span>
                                    <div className="pg-contact__channels">
                                        <a
                                            className="pg-contact__channel"
                                            href={`mailto:${contact.email}`}
                                        >
                                            <span className="pg-contact__channel-ico pg-contact__channel-ico--mail">
                                                <Mail size={17} aria-hidden="true" />
                                            </span>
                                            <span className="pg-contact__channel-txt">
                                                <small>Correo</small>
                                                <strong>{contact.email}</strong>
                                            </span>
                                        </a>
                                        <a className="pg-contact__channel" href={`tel:${contact.phone}`}>
                                            <span className="pg-contact__channel-ico pg-contact__channel-ico--phone">
                                                <Phone size={17} aria-hidden="true" />
                                            </span>
                                            <span className="pg-contact__channel-txt">
                                                <small>Llamada</small>
                                                <strong>{contact.phone}</strong>
                                            </span>
                                        </a>
                                        <a
                                            className="pg-contact__channel"
                                            href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="pg-contact__channel-ico pg-contact__channel-ico--whatsapp">
                                                <WhatsAppIcon size={16} />
                                            </span>
                                            <span className="pg-contact__channel-txt">
                                                <small>WhatsApp</small>
                                                <strong>{contact.whatsapp}</strong>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
