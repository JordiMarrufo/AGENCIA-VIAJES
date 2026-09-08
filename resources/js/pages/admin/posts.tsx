import { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Clock,
    ExternalLink,
    ImagePlus,
    Pencil,
    Plus,
    Tag,
    Trash2,
    Video,
    X,
} from 'lucide-react';
import { destroy, store, toggle, update } from '@/routes/admin/posts';
import { posts } from '@/routes/admin';
import { home } from '@/routes';

type TravelPostRow = {
    id: number;
    title: string;
    category: string;
    destination: string | null;
    excerpt: string | null;
    content: string;
    starts_at: string | null;
    ends_at: string | null;
    price: string | number | null;
    is_published: boolean;
    cover_image_url: string | null;
};

type Props = {
    posts: TravelPostRow[];
    errors?: Record<string, string>;
};

type Fields = {
    title: string;
    category: string;
    destination: string;
    excerpt: string;
    content: string;
    price: string;
    starts_at: string;
    ends_at: string;
    is_published: boolean;
};

const CATEGORY_LABELS: Record<string, string> = {
    upcoming: 'Próximo viaje',
    past: 'Viaje pasado',
    promotion: 'Promoción',
    offer: 'Oferta',
    combo: 'Combo',
};

const CATEGORY_TONES: Record<string, string> = {
    upcoming: 'tv-chip--rio',
    past: 'tv-chip--plata',
    promotion: 'tv-chip--magenta',
    offer: 'tv-chip--bosque',
    combo: 'tv-chip--mar',
};

const EMPTY: Fields = {
    title: '',
    category: 'upcoming',
    destination: '',
    excerpt: '',
    content: '',
    price: '',
    starts_at: '',
    ends_at: '',
    is_published: true,
};

function fromRow(post: TravelPostRow): Fields {
    return {
        title: post.title,
        category: post.category,
        destination: post.destination ?? '',
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        price: post.price !== null && post.price !== undefined ? String(post.price) : '',
        starts_at: String(post.starts_at ?? '').slice(0, 10),
        ends_at: String(post.ends_at ?? '').slice(0, 10),
        is_published: post.is_published,
    };
}

function fmtShort(value?: string | null): string {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdminPosts({ posts: records, errors = {} }: Props) {
    const { props } = usePage();
    const pageErrors = (props.errors ?? errors) as Record<string, string>;

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);

    const editing = useMemo(
        () => records.find((r) => r.id === editingId) ?? null,
        [records, editingId],
    );

    const openCreate = (): void => {
        setFields(EMPTY);
        setCoverFile(null);
        setVideoFile(null);
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (post: TravelPostRow): void => {
        setFields(fromRow(post));
        setCoverFile(null);
        setVideoFile(null);
        setCreating(false);
        setEditingId(post.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = (): void => {
        setCreating(false);
        setEditingId(null);
        setFields(EMPTY);
        setCoverFile(null);
        setVideoFile(null);
    };

    const updateField = <K extends keyof Fields>(key: K, value: Fields[K]): void => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (): void => {
        const payload: Record<string, string | number | boolean | File> = {
            title: fields.title,
            category: fields.category,
            content: fields.content,
            is_published: fields.is_published,
        };
        if (fields.destination.trim()) {
            payload.destination = fields.destination.trim();
        }
        if (fields.excerpt.trim()) {
            payload.excerpt = fields.excerpt.trim();
        }
        if (fields.price !== '') {
            payload.price = Number(fields.price);
        }
        if (fields.starts_at) {
            payload.starts_at = fields.starts_at;
        }
        if (fields.ends_at) {
            payload.ends_at = fields.ends_at;
        }
        if (coverFile) {
            payload.cover_image = coverFile;
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

    const togglePublish = (post: TravelPostRow): void => {
        router.patch(toggle(post.id).url, {}, { preserveScroll: true });
    };

    const remove = (post: TravelPostRow): void => {
        if (window.confirm(`¿Eliminar el viaje “${post.title}”?`)) {
            router.delete(destroy(post.id).url, { preserveScroll: true });
        }
    };

    const errorList = Object.values(pageErrors);
    const isFormOpen = creating || editingId !== null;

    return (
        <>
            <Head title="Viajes" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <Tag size={14} aria-hidden="true" />
                            Contenido del home
                        </span>
                        <h1>Viajes y paquetes</h1>
                        <p>
                            Administra los viajes que se muestran en la página
                            principal: próximos destinos, viajes pasados, promociones,
                            ofertas y combos.
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
                                Nuevo viaje
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {isFormOpen && (
                <section className="ad-panel" style={{ marginBottom: '1.6rem' }}>
                    <div className="ad-panel__head">
                        <h2>{editing ? `Editar: ${editing?.title}` : 'Nuevo viaje'}</h2>
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
                                    <label htmlFor="post-title">Título *</label>
                                    <input
                                        id="post-title"
                                        type="text"
                                        value={fields.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        placeholder="Ej. Cancún todo incluido"
                                    />
                                </div>

                                <div className="tv-field ad-field">
                                    <label htmlFor="post-category">Categoría *</label>
                                    <select
                                        id="post-category"
                                        value={fields.category}
                                        onChange={(e) => updateField('category', e.target.value)}
                                    >
                                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="post-destination">Destino</label>
                                    <input
                                        id="post-destination"
                                        type="text"
                                        value={fields.destination}
                                        onChange={(e) => updateField('destination', e.target.value)}
                                        placeholder="Ej. Cancún, México"
                                    />
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="post-price">Precio (USD)</label>
                                    <input
                                        id="post-price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={fields.price}
                                        onChange={(e) => updateField('price', e.target.value)}
                                        placeholder="Ej. 499"
                                    />
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="post-starts">Fecha de inicio</label>
                                    <input
                                        id="post-starts"
                                        type="date"
                                        value={fields.starts_at}
                                        onChange={(e) => updateField('starts_at', e.target.value)}
                                    />
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="post-ends">Fecha de fin</label>
                                    <input
                                        id="post-ends"
                                        type="date"
                                        value={fields.ends_at}
                                        onChange={(e) => updateField('ends_at', e.target.value)}
                                    />
                                </div>

                                <div className="tv-field ad-span">
                                    <label htmlFor="post-excerpt">Resumen corto</label>
                                    <textarea
                                        id="post-excerpt"
                                        rows={2}
                                        maxLength={500}
                                        value={fields.excerpt}
                                        onChange={(e) => updateField('excerpt', e.target.value)}
                                        placeholder="Una descripción breve para las tarjetas"
                                    />
                                </div>

                                <div className="tv-field ad-span">
                                    <label htmlFor="post-content">Descripción *</label>
                                    <textarea
                                        id="post-content"
                                        rows={5}
                                        value={fields.content}
                                        onChange={(e) => updateField('content', e.target.value)}
                                        placeholder="Descripción completa del viaje"
                                    />
                                </div>
                            </div>

                            <div className="ad-grid">
                                <div className="tv-field ad-span">
                                    <label htmlFor="post-cover">Imagen de portada</label>
                                    <div className="ad-file">
                                        <input
                                            id="post-cover"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setCoverFile(e.target.files?.[0] ?? null)
                                            }
                                        />
                                    </div>
                                    {(coverFile || editing?.cover_image_url) && (
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div className="ad-preview">
                                                {coverFile ? (
                                                    <img
                                                        src={URL.createObjectURL(coverFile)}
                                                        alt="Vista previa de la portada"
                                                    />
                                                ) : (
                                                    <img
                                                        src={editing?.cover_image_url ?? ''}
                                                        alt={editing?.title ?? 'Portada actual'}
                                                    />
                                                )}
                                            </div>
                                            <span className="ad-row__meta">
                                                <ImagePlus size={14} aria-hidden="true" />
                                                {coverFile
                                                    ? `Nueva imagen: ${coverFile.name}`
                                                    : 'Imagen actual'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="tv-field ad-span">
                                    <label htmlFor="post-video">Video (mp4, webm, mov)</label>
                                    <div className="ad-file">
                                        <input
                                            id="post-video"
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
                                    {busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear viaje'}
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
                        <h2 id="list-heading">Viajes registrados</h2>
                        <p>
                            {records.length} {records.length === 1 ? 'viaje' : 'viajes'} en total
                        </p>
                    </div>
                </div>

                <div className="ad-panel">
                    {records.length === 0 ? (
                        <div className="ad-empty">
                            <ImagePlus size={36} aria-hidden="true" />
                            <p>Aún no hay viajes registrados.</p>
                        </div>
                    ) : (
                        <div className="ad-list">
                            {records.map((post) => (
                                <div className="ad-row" key={post.id}>
                                    <div className="ad-row__thumb">
                                        {post.cover_image_url ? (
                                            <img src={post.cover_image_url} alt={post.title} />
                                        ) : (
                                            <ImagePlus size={28} aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="ad-row__main">
                                        <div className="ad-row__title">
                                            {post.title}
                                            <span
                                                className={`tv-chip ${
                                                    CATEGORY_TONES[post.category] ?? 'tv-chip--plata'
                                                }`}
                                            >
                                                {CATEGORY_LABELS[post.category] ?? post.category}
                                            </span>
                                            <span
                                                className={`ad-pub ${post.is_published ? 'ad-pub--on' : 'ad-pub--off'}`}
                                            >
                                                {post.is_published ? 'Publicado' : 'Oculto'}
                                            </span>
                                        </div>
                                        <div className="ad-row__meta">
                                            {post.destination && (
                                                <span>
                                                    <Tag size={13} aria-hidden="true" />
                                                    {post.destination}
                                                </span>
                                            )}
                                            {(post.starts_at || post.ends_at) && (
                                                <span>
                                                    <CalendarDays size={13} aria-hidden="true" />
                                                    {fmtShort(post.starts_at)}
                                                    {post.ends_at ? ` — ${fmtShort(post.ends_at)}` : ''}
                                                </span>
                                            )}
                                            {post.price !== null && post.price !== '' && (
                                                <span>
                                                    <Clock size={13} aria-hidden="true" />
                                                    Desde ${post.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ad-row__actions">
                                        <button
                                            type="button"
                                            className={`ad-toggle${post.is_published ? ' is-on' : ''}`}
                                            aria-label={post.is_published ? 'Ocultar viaje' : 'Publicar viaje'}
                                            aria-pressed={post.is_published}
                                            title={post.is_published ? 'Ocultar viaje' : 'Publicar viaje'}
                                            onClick={() => togglePublish(post)}
                                        />
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--soft"
                                            onClick={() => openEdit(post)}
                                        >
                                            <Pencil size={13} aria-hidden="true" />
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--danger"
                                            onClick={() => remove(post)}
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
