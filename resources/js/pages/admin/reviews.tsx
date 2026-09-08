import { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Camera,
    ExternalLink,
    MapPin,
    MessageSquareQuote,
    Pencil,
    Plus,
    Quote,
    Star,
    Trash2,
    Video,
    X,
} from 'lucide-react';
import { destroy, store, toggle, update } from '@/routes/admin/reviews';
import { reviews } from '@/routes/admin';
import { home } from '@/routes';

type ReviewRow = {
    id: number;
    author_name: string;
    destination: string | null;
    rating: number;
    content: string;
    photo_path: string | null;
    video_path: string | null;
    is_published: boolean;
    created_at?: string;
};

type Props = {
    reviews: ReviewRow[];
    errors?: Record<string, string>;
};

type Fields = {
    author_name: string;
    destination: string;
    rating: string;
    content: string;
    is_published: boolean;
};

const EMPTY: Fields = {
    author_name: '',
    destination: '',
    rating: '5',
    content: '',
    is_published: true,
};

function fromRow(review: ReviewRow): Fields {
    return {
        author_name: review.author_name,
        destination: review.destination ?? '',
        rating: String(review.rating),
        content: review.content,
        is_published: review.is_published,
    };
}

function stars(value: number): Array<'full' | 'empty'> {
    return Array.from({ length: 5 }, (_, i) => (i < value ? 'full' : 'empty'));
}

function mediaUrl(path?: string | null): string | null {
    return path ? `/storage/${path}` : null;
}

export default function AdminReviews({ reviews: records, errors = {} }: Props) {
    const { props } = usePage();
    const pageErrors = (props.errors ?? errors) as Record<string, string>;

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);

    const editing = useMemo(
        () => records.find((r) => r.id === editingId) ?? null,
        [records, editingId],
    );

    const openCreate = (): void => {
        setFields(EMPTY);
        setPhotoFile(null);
        setVideoFile(null);
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (review: ReviewRow): void => {
        setFields(fromRow(review));
        setPhotoFile(null);
        setVideoFile(null);
        setCreating(false);
        setEditingId(review.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = (): void => {
        setCreating(false);
        setEditingId(null);
        setFields(EMPTY);
        setPhotoFile(null);
        setVideoFile(null);
    };

    const updateField = <K extends keyof Fields>(key: K, value: Fields[K]): void => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (): void => {
        const payload: Record<string, string | number | boolean | File> = {
            author_name: fields.author_name,
            rating: Number(fields.rating),
            content: fields.content,
            is_published: fields.is_published,
        };
        if (fields.destination.trim()) {
            payload.destination = fields.destination.trim();
        }
        if (photoFile) {
            payload.photo = photoFile;
        }
        if (videoFile) {
            payload.video_file = videoFile;
        }

        const onSuccess = (): void => {
            setBusy(false);
            cancel();
        };

        setBusy(true);
        if (editingId !== null) {
            router.put(update(editingId).url, payload, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess,
                onError: () => setBusy(false),
            });
        } else {
            router.post(store().url, payload, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess,
                onError: () => setBusy(false),
            });
        }
    };

    const togglePublish = (review: ReviewRow): void => {
        router.patch(toggle(review.id).url, {}, { preserveScroll: true });
    };

    const remove = (review: ReviewRow): void => {
        if (window.confirm(`¿Eliminar la reseña de “${review.author_name}”?`)) {
            router.delete(destroy(review.id).url, { preserveScroll: true });
        }
    };

    const errorList = Object.values(pageErrors);
    const isFormOpen = creating || editingId !== null;

    return (
        <>
            <Head title="Reseñas" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <MessageSquareQuote size={14} aria-hidden="true" />
                            Contenido del home
                        </span>
                        <h1>Reseñas de viajeros</h1>
                        <p>
                            Los testimonios de quienes ya viajaron con nosotros. Se
                            muestran en el home y generan confianza en nuevos viajeros.
                        </p>
                    </div>
                    <div className="ad-toolbar">
                        <Link href={home()} className="tv-btn tv-btn--soft" target="_blank">
                            <ExternalLink size={16} aria-hidden="true" />
                            Ver sitio
                        </Link>
                        {!isFormOpen && (
                            <button type="button" className="tv-btn tv-btn--magenta" onClick={openCreate}>
                                <Plus size={16} aria-hidden="true" />
                                Nueva reseña
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {isFormOpen && (
                <section className="ad-panel" style={{ marginBottom: '1.6rem' }}>
                    <div className="ad-panel__head">
                        <h2>{editing ? `Editar reseña de ${editing?.author_name}` : 'Nueva reseña'}</h2>
                        <button type="button" className="tv-btn tv-btn--xs tv-btn--soft" onClick={cancel}>
                            <X size={14} aria-hidden="true" />
                            Cancelar
                        </button>
                    </div>
                    <div className="ad-panel__body">
                        {errorList.length > 0 && (
                            <div className="ad-form__error" style={{ marginBottom: '1rem' }}>
                                {errorList.map((message) => (
                                    <div key={message}>{message}</div>
                                ))}
                            </div>
                        )}

                        <div className="tv-form">
                            <div className="ad-grid">
                                <div className="tv-field">
                                    <label htmlFor="review-author">Nombre del viajero *</label>
                                    <input
                                        id="review-author"
                                        type="text"
                                        value={fields.author_name}
                                        onChange={(e) => updateField('author_name', e.target.value)}
                                        placeholder="Ej. María García"
                                    />
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="review-destination">Destino visitado</label>
                                    <input
                                        id="review-destination"
                                        type="text"
                                        value={fields.destination}
                                        onChange={(e) => updateField('destination', e.target.value)}
                                        placeholder="Ej. Riviera Maya"
                                    />
                                </div>

                                <div className="tv-field ad-field">
                                    <label htmlFor="review-rating">Calificación *</label>
                                    <select
                                        id="review-rating"
                                        value={fields.rating}
                                        onChange={(e) => updateField('rating', e.target.value)}
                                    >
                                        {[5, 4, 3, 2, 1].map((value) => (
                                            <option key={value} value={value}>
                                                {'★'.repeat(value)}{'☆'.repeat(5 - value)} — {value}/5
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="tv-field ad-span">
                                    <label htmlFor="review-content">Testimonio *</label>
                                    <textarea
                                        id="review-content"
                                        rows={4}
                                        maxLength={2000}
                                        value={fields.content}
                                        onChange={(e) => updateField('content', e.target.value)}
                                        placeholder="Lo que el viajero cuenta de su experiencia"
                                    />
                                </div>
                            </div>

                            <div className="ad-grid">
                                <div className="tv-field ad-span">
                                    <label htmlFor="review-photo">Foto del viajero</label>
                                    <div className="ad-file">
                                        <input
                                            id="review-photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setPhotoFile(e.target.files?.[0] ?? null)
                                            }
                                        />
                                    </div>
                                    {(photoFile || mediaUrl(editing?.photo_path)) && (
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="ad-preview ad-preview--round">
                                                {photoFile ? (
                                                    <img
                                                        src={URL.createObjectURL(photoFile)}
                                                        alt="Vista previa de la foto"
                                                    />
                                                ) : (
                                                    <img
                                                        src={mediaUrl(editing?.photo_path) ?? ''}
                                                        alt={editing?.author_name ?? 'Foto actual'}
                                                    />
                                                )}
                                            </div>
                                            <span className="ad-row__meta">
                                                <Camera size={14} aria-hidden="true" />
                                                {photoFile
                                                    ? `Nueva foto: ${photoFile.name}`
                                                    : 'Foto actual'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="tv-field ad-span">
                                    <label htmlFor="review-video">Video (mp4, webm, mov)</label>
                                    <div className="ad-file">
                                        <input
                                            id="review-video"
                                            type="file"
                                            accept="video/mp4,video/webm,video/quicktime"
                                            onChange={(e) =>
                                                setVideoFile(e.target.files?.[0] ?? null)
                                            }
                                        />
                                    </div>
                                    {videoFile && (
                                        <span className="ad-row__meta">
                                            <Video size={14} aria-hidden="true" />
                                            {videoFile.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <label className="ad-check">
                                <input
                                    type="checkbox"
                                    checked={fields.is_published}
                                    onChange={(e) => updateField('is_published', e.target.checked)}
                                />
                                Publicar en el sitio
                            </label>

                            <div className="ad-toolbar">
                                <button
                                    type="button"
                                    className="tv-btn tv-btn--magenta"
                                    onClick={submit}
                                    disabled={busy}
                                >
                                    {busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear reseña'}
                                </button>
                                <button type="button" className="tv-btn tv-btn--soft" onClick={cancel}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section aria-labelledby="list-heading">
                <div className="ad-sec">
                    <div>
                        <h2 id="list-heading">Reseñas registradas</h2>
                        <p>
                            {records.length} {records.length === 1 ? 'reseña' : 'reseñas'} en total
                        </p>
                    </div>
                </div>

                <div className="ad-panel">
                    {records.length === 0 ? (
                        <div className="ad-empty">
                            <Quote size={36} aria-hidden="true" />
                            <p>Aún no hay reseñas registradas.</p>
                        </div>
                    ) : (
                        <div className="ad-list">
                            {records.map((review) => (
                                <div className="ad-row" key={review.id}>
                                    <div className="ad-row__thumb ad-row__thumb--round">
                                        {mediaUrl(review.photo_path) ? (
                                            <img
                                                src={mediaUrl(review.photo_path) ?? ''}
                                                alt={review.author_name}
                                            />
                                        ) : (
                                            <Quote size={28} aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="ad-row__main">
                                        <div className="ad-row__title">
                                            {review.author_name}
                                            <span className="ad-row__stars" aria-label={`${review.rating} de 5 estrellas`}>
                                                {stars(review.rating).map((kind, i) => (
                                                    <Star
                                                        key={i}
                                                        size={13}
                                                        aria-hidden="true"
                                                        className={kind === 'full' ? 'is-full' : ''}
                                                    />
                                                ))}
                                            </span>
                                            <span
                                                className={`ad-pub ${review.is_published ? 'ad-pub--on' : 'ad-pub--off'}`}
                                            >
                                                {review.is_published ? 'Publicada' : 'Oculta'}
                                            </span>
                                        </div>
                                        <div className="ad-row__meta">
                                            {review.destination && (
                                                <span>
                                                    <MapPin size={13} aria-hidden="true" />
                                                    {review.destination}
                                                </span>
                                            )}
                                        </div>
                                        <p className="ad-row__text">“{review.content}”</p>
                                    </div>
                                    <div className="ad-row__actions">
                                        <button
                                            type="button"
                                            className={`ad-toggle${review.is_published ? ' is-on' : ''}`}
                                            aria-label={review.is_published ? 'Ocultar reseña' : 'Publicar reseña'}
                                            aria-pressed={review.is_published}
                                            title={review.is_published ? 'Ocultar reseña' : 'Publicar reseña'}
                                            onClick={() => togglePublish(review)}
                                        />
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--soft"
                                            onClick={() => openEdit(review)}
                                        >
                                            <Pencil size={13} aria-hidden="true" />
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--danger"
                                            onClick={() => remove(review)}
                                        >
                                            <Trash2 size={13} aria-hidden="true" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
