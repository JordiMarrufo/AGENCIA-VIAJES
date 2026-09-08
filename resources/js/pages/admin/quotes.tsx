import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Feather,
    Pencil,
    Plus,
    Quote,
    Trash2,
    X,
} from 'lucide-react';
import { destroy, store, toggle, update } from '@/routes/admin/quotes';
import { home } from '@/routes';

type QuoteRow = {
    id: number;
    quote: string;
    author: string | null;
    is_published: boolean;
    created_at?: string;
};

type Props = {
    quotes: QuoteRow[];
    errors?: Record<string, string>;
};

type Fields = {
    quote: string;
    author: string;
    is_published: boolean;
};

const EMPTY: Fields = {
    quote: '',
    author: '',
    is_published: true,
};

function fromRow(quote: QuoteRow): Fields {
    return {
        quote: quote.quote,
        author: quote.author ?? '',
        is_published: quote.is_published,
    };
}

export default function AdminQuotes({ quotes: records, errors = {} }: Props) {
    const { props } = usePage();
    const pageErrors = (props.errors ?? errors) as Record<string, string>;

    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [fields, setFields] = useState<Fields>(EMPTY);
    const [busy, setBusy] = useState(false);

    const editing = records.find((r) => r.id === editingId) ?? null;

    const openCreate = (): void => {
        setFields(EMPTY);
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (record: QuoteRow): void => {
        setFields(fromRow(record));
        setCreating(false);
        setEditingId(record.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancel = (): void => {
        setCreating(false);
        setEditingId(null);
        setFields(EMPTY);
    };

    const updateField = <K extends keyof Fields>(key: K, value: Fields[K]): void => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (): void => {
        const payload: Record<string, string | boolean> = {
            quote: fields.quote,
            is_published: fields.is_published,
        };
        if (fields.author.trim()) {
            payload.author = fields.author.trim();
        }

        const onSuccess = (): void => {
            setBusy(false);
            cancel();
        };

        setBusy(true);
        if (editingId !== null) {
            router.put(update(editingId).url, payload, {
                preserveScroll: true,
                onSuccess,
                onError: () => setBusy(false),
            });
        } else {
            router.post(store().url, payload, {
                preserveScroll: true,
                onSuccess,
                onError: () => setBusy(false),
            });
        }
    };

    const togglePublish = (record: QuoteRow): void => {
        router.patch(toggle(record.id).url, {}, { preserveScroll: true });
    };

    const remove = (record: QuoteRow): void => {
        if (window.confirm('¿Eliminar esta frase?')) {
            router.delete(destroy(record.id).url, { preserveScroll: true });
        }
    };

    const errorList = Object.values(pageErrors);
    const isFormOpen = creating || editingId !== null;

    return (
        <>
            <Head title="Frases" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <Feather size={14} aria-hidden="true" />
                            Contenido del home
                        </span>
                        <h1>Frases del home</h1>
                        <p>
                            Frases y citas inspiradoras de viaje. Aparecen en la sección
                            destacada de la página principal.
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
                                Nueva frase
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {isFormOpen && (
                <section className="ad-panel" style={{ marginBottom: '1.6rem' }}>
                    <div className="ad-panel__head">
                        <h2>{editing ? 'Editar frase' : 'Nueva frase'}</h2>
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
                                <div className="tv-field ad-span">
                                    <label htmlFor="quote-text">Frase *</label>
                                    <textarea
                                        id="quote-text"
                                        rows={3}
                                        maxLength={1000}
                                        value={fields.quote}
                                        onChange={(e) => updateField('quote', e.target.value)}
                                        placeholder="Ej. Viajar es la única cosa que compras y te hace más rico"
                                    />
                                </div>

                                <div className="tv-field">
                                    <label htmlFor="quote-author">Autor</label>
                                    <input
                                        id="quote-author"
                                        type="text"
                                        maxLength={120}
                                        value={fields.author}
                                        onChange={(e) => updateField('author', e.target.value)}
                                        placeholder="Ej. Anónimo"
                                    />
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
                                    {busy ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear frase'}
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
                        <h2 id="list-heading">Frases registradas</h2>
                        <p>
                            {records.length} {records.length === 1 ? 'frase' : 'frases'} en total
                        </p>
                    </div>
                </div>

                <div className="ad-panel">
                    {records.length === 0 ? (
                        <div className="ad-empty">
                            <Quote size={36} aria-hidden="true" />
                            <p>Aún no hay frases registradas.</p>
                        </div>
                    ) : (
                        <div className="ad-list">
                            {records.map((record) => (
                                <div className="ad-row" key={record.id}>
                                    <div className="ad-row__quote" aria-hidden="true">
                                        <Quote size={26} />
                                    </div>
                                    <div className="ad-row__main">
                                        <p className="ad-row__text ad-row__text--quote">“{record.quote}”</p>
                                        <div className="ad-row__meta">
                                            {record.author && <span>— {record.author}</span>}
                                        </div>
                                    </div>
                                    <div className="ad-row__actions">
                                        <button
                                            type="button"
                                            className={`ad-toggle${record.is_published ? ' is-on' : ''}`}
                                            aria-label={record.is_published ? 'Ocultar frase' : 'Publicar frase'}
                                            aria-pressed={record.is_published}
                                            title={record.is_published ? 'Ocultar frase' : 'Publicar frase'}
                                            onClick={() => togglePublish(record)}
                                        />
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--soft"
                                            onClick={() => openEdit(record)}
                                        >
                                            <Pencil size={13} aria-hidden="true" />
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            className="tv-btn tv-btn--xs tv-btn--danger"
                                            onClick={() => remove(record)}
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
