import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    Clock,
    Compass,
    ExternalLink,
    Eye,
    FileText,
    Film,
    ImagePlus,
    Pencil,
    Plus,
    RefreshCw,
    Tag,
    Trash2,
    Upload,
    X,
} from 'lucide-react';
import { destroy, store, toggle, update } from '@/routes/admin/posts';
import { posts } from '@/routes/admin';
import { home } from '@/routes';
import MediaGallery, { type MediaEntry } from '@/components/admin/media-gallery';
import TravelCard from '@/components/public/travel-card';
import type { TravelPostData } from '@/types/travel';

type TravelPostRow = {
    id: number;
    title: string;
    slug: string;
    category: string;
    destination: string | null;
    excerpt: string | null;
    content: string;
    starts_at: string | null;
    ends_at: string | null;
    price: string | number | null;
    is_published: boolean;
    cover_image_url: string | null;
    gallery_image_urls: string[];
    gallery_video_urls: string[];
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

/* Color de relleno de las pastillas de categoría del formulario */
const PILL_TONES: Record<string, string> = {
    upcoming: 'rio',
    past: 'plata',
    promotion: 'magenta',
    offer: 'bosque',
    combo: 'mar',
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

type DropzoneProps = {
    id: string;
    kind: 'image' | 'video';
    accept: string;
    file: File | null;
    previewUrl?: string | null;
    currentTitle?: string;
    onFile: (file: File | null) => void;
};

/* Zona interactiva para arrastrar y soltar archivos (imagen o video) */
function AdDropzone({
    id,
    kind,
    accept,
    file,
    previewUrl = null,
    currentTitle = 'Archivo actual',
    onFile,
}: DropzoneProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [over, setOver] = useState(false);

    const hasImage = kind === 'image' && Boolean(previewUrl);

    const openPicker = (): void => {
        inputRef.current?.click();
    };

    return (
        <div
            className={[
                'ad-drop',
                `ad-drop--${kind}`,
                hasImage ? 'has-media' : '',
                kind === 'video' && file ? 'has-file' : '',
                over ? 'is-over' : '',
            ]
                .filter(Boolean)
                .join(' ')}
            aria-label={
                kind === 'image'
                    ? 'Imagen de portada: arrastra una foto o pulsa para elegir'
                    : 'Video del viaje: arrastra un archivo o pulsa para elegir'
            }
            onClick={openPicker}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPicker();
                }
            }}
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) {
                    onFile(dropped);
                }
            }}
        >
            <input
                ref={inputRef}
                id={id}
                type="file"
                className="ad-drop__input"
                accept={accept}
                tabIndex={-1}
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />

            {kind === 'image' && previewUrl ? (
                <>
                    <img
                        className="ad-drop__img"
                        src={previewUrl}
                        alt="Vista previa de la portada"
                        draggable={false}
                    />
                    <span className="ad-drop__overlay">
                        <Upload size={17} aria-hidden="true" />
                        {over ? 'Suelta para reemplazar' : 'Pulsa o arrastra para reemplazar'}
                    </span>
                    {file && (
                        <button
                            type="button"
                            className="ad-drop__clear"
                            title="Quitar la imagen nueva"
                            aria-label="Quitar la imagen nueva elegida"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onFile(null);
                            }}
                        >
                            <Trash2 size={15} aria-hidden="true" />
                        </button>
                    )}
                </>
            ) : (
                <span className="ad-drop__prompt">
                    <span className="ad-drop__ico" aria-hidden="true">
                        {kind === 'image' ? (
                            <ImagePlus size={26} />
                        ) : (
                            <Film size={26} />
                        )}
                    </span>
                    <strong>
                        {kind === 'image'
                            ? 'Arrastra la foto de portada aquí'
                            : file
                              ? `Video seleccionado: ${file.name}`
                              : 'Arrastra el video aquí'}
                    </strong>
                    <span className="ad-drop__hint">
                        {kind === 'image'
                            ? 'JPG, PNG o WEBP · también puedes pulsar para elegir'
                            : 'mp4, webm o mov · también puedes pulsar para elegir'}
                    </span>
                    {file ? (
                        <button
                            type="button"
                            className="tv-btn tv-btn--sm tv-btn--danger"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onFile(null);
                            }}
                        >
                            Quitar video
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="tv-btn tv-btn--sm tv-btn--soft"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openPicker();
                            }}
                        >
                            <Upload size={15} aria-hidden="true" />
                            Elegir archivo
                        </button>
                    )}
                </span>
            )}

            {kind === 'image' && previewUrl && !file && (
                <span className="ad-drop__current">{currentTitle}</span>
            )}
        </div>
    );
}

export default function AdminPosts({ posts: records, errors = {} }: Props) {
    const { props } = usePage();
    const pageErrors = (props.errors ?? errors) as Record<string, string>;

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPhotos, setGalleryPhotos] = useState<MediaEntry[]>([]);
    const [galleryVideos, setGalleryVideos] = useState<MediaEntry[]>([]);

    useEffect(() => {
        if (!coverFile) {
            setCoverPreview(null);
            return;
        }
        const url = URL.createObjectURL(coverFile);
        setCoverPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [coverFile]);

    const editing = useMemo(
        () => records.find((r) => r.id === editingId) ?? null,
        [records, editingId],
    );

    const previewPost = useMemo<TravelPostData>(
        () => ({
            id: editingId ?? 0,
            title: fields.title.trim() || 'Título del viaje',
            slug: editing?.slug ?? '',
            category: fields.category as TravelPostData['category'],
            destination: fields.destination.trim() || null,
            excerpt: fields.excerpt.trim() || null,
            content: fields.content,
            price: fields.price !== '' ? fields.price : null,
            starts_at: fields.starts_at || null,
            ends_at: fields.ends_at || null,
            cover_image_url: coverPreview ?? editing?.cover_image_url ?? null,
            gallery_image_urls: [],
            gallery_video_urls: [],
        }),
        [fields, editingId, editing, coverPreview],
    );

    const openCreate = (): void => {
        clearGallery();
        setFields(EMPTY);
        setCoverFile(null);
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (post: TravelPostRow): void => {
        setFields(fromRow(post));
        setCoverFile(null);
        setGalleryPhotos(photosFromRow(post));
        setGalleryVideos(videosFromRow(post));
        setCreating(false);
        setEditingId(post.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = (): void => {
        clearGallery();
        setCreating(false);
        setEditingId(null);
        setFields(EMPTY);
        setCoverFile(null);
    };

    const clearGallery = (): void => {
        for (const entry of galleryPhotos) {
            if (entry.file && entry.url) {
                URL.revokeObjectURL(entry.url);
            }
        }
        for (const entry of galleryVideos) {
            if (entry.file && entry.url) {
                URL.revokeObjectURL(entry.url);
            }
        }
        setGalleryPhotos([]);
        setGalleryVideos([]);
    };

    const photosFromRow = (post: TravelPostRow): MediaEntry[] => {
        const cover = post.cover_image_url;
        const urls = (post.gallery_image_urls ?? []).filter((url) => url !== cover);

        return urls.map((url) => ({
            id: url,
            kind: 'image' as const,
            url,
            file: null,
            name: url.split('/').pop() ?? url,
        }));
    };

    const videosFromRow = (post: TravelPostRow): MediaEntry[] =>
        (post.gallery_video_urls ?? []).map((url) => ({
            id: url,
            kind: 'video' as const,
            url,
            file: null,
            name: url.split('/').pop() ?? url,
        }));

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

        const photosOrder = galleryPhotos.map((entry) =>
            entry.file ? `new:${entry.id}` : entry.url ?? '',
        );
        const videosOrder = galleryVideos.map((entry) =>
            entry.file ? `new:${entry.id}` : entry.url ?? '',
        );
        payload.photos_order = JSON.stringify(photosOrder);
        payload.videos_order = JSON.stringify(videosOrder);
        for (const entry of galleryPhotos) {
            if (entry.file) {
                payload[`gallery_photo_${entry.id}`] = entry.file;
            }
        }
        for (const entry of galleryVideos) {
            if (entry.file) {
                payload[`gallery_video_${entry.id}`] = entry.file;
            }
        }

        const onSuccess = (): void => {
            setBusy(false);
            cancel();
        };

        setBusy(true);
        if (editingId !== null) {
            // PHP sólo parsea cuerpos multipart en peticiones POST, así que se
            // envía POST con method spoofing (_method=PUT) para subir archivos.
            router.post(update(editingId).url, { ...payload, _method: 'put' }, {
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
                <section className="ad-panel ad-panel--edit">
                    <div className="ad-panel__head ad-panel__head--edit">
                        <div>
                            <h2>
                                {editing ? (
                                    <>
                                        <Pencil size={15} aria-hidden="true" />
                                        {`Editar: ${editing?.title}`}
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} aria-hidden="true" />
                                        Nuevo viaje
                                    </>
                                )}
                            </h2>
                            <p className="ad-panel__sub">
                                {editing
                                    ? 'Ajusta los datos y guarda cuando quieras. La vista previa se actualiza al instante.'
                                    : 'Completa la información para publicar un nuevo viaje.'}
                            </p>
                        </div>
                        <button type="button" className="tv-btn tv-btn--xs tv-btn--soft" onClick={cancel}>
                            <X size={14} aria-hidden="true" />
                            Cancelar
                        </button>
                    </div>

                    <div className="ad-panel__body">
                        {errorList.length > 0 && (
                            <div className="ad-form__error" style={{ marginBottom: '1.4rem' }}>
                                {errorList.map((message) => (
                                    <div key={message}>{message}</div>
                                ))}
                            </div>
                        )}

                        <div className="ad-edit">
                            <div className="ad-edit__main">
                                <section className="ad-fs" aria-label="Información del viaje">
                                    <header className="ad-fs__head">
                                        <span className="ad-fs__ico ad-fs__ico--mar">
                                            <Compass size={18} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3>Información del viaje</h3>
                                            <p>Título, categoría y datos básicos del destino.</p>
                                        </div>
                                    </header>
                                    <div className="ad-fs__body">
                                        <div className="tv-form">
                                            <div className="ad-grid">
                                                <div className="tv-field ad-span">
                                                    <label htmlFor="post-title">Título *</label>
                                                    <input
                                                        id="post-title"
                                                        type="text"
                                                        value={fields.title}
                                                        onChange={(e) => updateField('title', e.target.value)}
                                                        placeholder="Ej. Sol de Cancún"
                                                    />
                                                </div>

                                                <div className="tv-field ad-span">
                                                    <label id="post-category-label">Categoría *</label>
                                                    <div
                                                        className="ad-pills"
                                                        role="radiogroup"
                                                        aria-labelledby="post-category-label"
                                                    >
                                                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                                            <label
                                                                key={value}
                                                                className={`ad-pill ad-pill--${PILL_TONES[value]} ${
                                                                    fields.category === value ? 'is-checked' : ''
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="post-category"
                                                                    value={value}
                                                                    checked={fields.category === value}
                                                                    onChange={() => updateField('category', value)}
                                                                />
                                                                <span className="ad-pill__dot" aria-hidden="true" />
                                                                {label}
                                                            </label>
                                                        ))}
                                                    </div>
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
                                                    <div className="ad-input-ico">
                                                        <span aria-hidden="true">$</span>
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
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="ad-fs" aria-label="Contenido del viaje">
                                    <header className="ad-fs__head">
                                        <span className="ad-fs__ico ad-fs__ico--rio">
                                            <FileText size={18} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3>Contenido</h3>
                                            <p>El texto que acompaña a la tarjeta y a la página del viaje.</p>
                                        </div>
                                    </header>
                                    <div className="ad-fs__body">
                                        <div className="tv-form">
                                            <div className="ad-grid">
                                                <div className="tv-field ad-span">
                                                    <label htmlFor="post-excerpt">Resumen corto</label>
                                                    <textarea
                                                        id="post-excerpt"
                                                        rows={2}
                                                        maxLength={500}
                                                        value={fields.excerpt}
                                                        onChange={(e) => updateField('excerpt', e.target.value)}
                                                        placeholder="Una descripción breve que aparece en las tarjetas"
                                                    />
                                                </div>

                                                <div className="tv-field ad-span">
                                                    <label htmlFor="post-content">Descripción *</label>
                                                    <textarea
                                                        id="post-content"
                                                        rows={6}
                                                        value={fields.content}
                                                        onChange={(e) => updateField('content', e.target.value)}
                                                        placeholder="Cuenta los detalles del viaje: itinerario, alojamiento, actividades…"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="ad-fs" aria-label="Imagen y video del viaje">
                                    <header className="ad-fs__head">
                                        <span className="ad-fs__ico ad-fs__ico--magenta">
                                            <ImagePlus size={18} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3>Imágenes y videos</h3>
                                            <p>
                                                Portada, fotos extra y videos de la galería. Arrastra para reordenar.
                                            </p>
                                        </div>
                                    </header>
                                    <div className="ad-fs__body">
                                        <div className="tv-form">
                                            <div className="tv-field">
                                                <label htmlFor="post-cover">Imagen de portada</label>
                                                <AdDropzone
                                                    id="post-cover"
                                                    kind="image"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    file={coverFile}
                                                    previewUrl={coverPreview ?? editing?.cover_image_url ?? null}
                                                    currentTitle={
                                                        editing ? `Imagen actual · ${editing.title}` : 'Sin imagen por ahora'
                                                    }
                                                    onFile={setCoverFile}
                                                />
                                            </div>

                                            <div className="tv-field" style={{ marginTop: '1.1rem' }}>
                                                <MediaGallery
                                                    id="post-gallery-photos"
                                                    kind="image"
                                                    label="Fotos de la galería"
                                                    hint="Arrastra o elige tus fotos del viaje"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    entries={galleryPhotos}
                                                    onChange={setGalleryPhotos}
                                                />
                                            </div>

                                            <div className="tv-field" style={{ marginTop: '1.1rem' }}>
                                                <MediaGallery
                                                    id="post-gallery-videos"
                                                    kind="video"
                                                    label="Videos del viaje"
                                                    hint="Arrastra o elige los videos del viaje"
                                                    accept="video/mp4,video/webm,video/quicktime"
                                                    entries={galleryVideos}
                                                    onChange={setGalleryVideos}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <footer className="ad-edit__foot">
                                    <label className="ad-switch">
                                        <input
                                            type="checkbox"
                                            checked={fields.is_published}
                                            onChange={(e) => updateField('is_published', e.target.checked)}
                                        />
                                        <span className="ad-switch__track" aria-hidden="true">
                                            <span className="ad-switch__knob" />
                                        </span>
                                        <span className="ad-switch__text">
                                            <strong>{fields.is_published ? 'Publicado' : 'Borrador'}</strong>
                                            <small>
                                                {fields.is_published
                                                    ? 'Visible en el sitio para tus clientes'
                                                    : 'Solo lo verás tú en el panel'}
                                            </small>
                                        </span>
                                    </label>

                                    <div className="ad-edit__actions">
                                        <button type="button" className="tv-btn tv-btn--soft" onClick={cancel}>
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--magenta"
                                            onClick={submit}
                                            disabled={busy}
                                        >
                                            {busy ? (
                                                <RefreshCw size={16} aria-hidden="true" className="ad-spin" />
                                            ) : (
                                                <Check size={16} aria-hidden="true" />
                                            )}
                                            {busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear viaje'}
                                        </button>
                                    </div>
                                </footer>
                            </div>

                            <aside className="ad-edit__side">
                                <div className="ad-edit__preview">
                                    <header className="ad-edit__preview-head">
                                        <span className="ad-edit__preview-ico">
                                            <Eye size={16} aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3>Vista previa</h3>
                                            <p>Así se verá la tarjeta en el home.</p>
                                        </div>
                                    </header>
                                    <div className="ad-edit__preview-stage" aria-hidden="true">
                                        <TravelCard post={previewPost} linkLabel="Reservar" linkHref="#" />
                                    </div>
                                </div>
                            </aside>
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
