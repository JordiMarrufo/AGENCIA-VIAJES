import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import type { Auth } from '@/types/auth';
import '../../../css/admin-content.css';

type Post = {
    id: number;
    title: string;
    category: string;
    destination: string | null;
    is_published: boolean;
};

type Review = {
    id: number;
    author_name: string;
    destination: string | null;
    rating: number;
    content: string;
    is_published: boolean;
};

type Quote = {
    id: number;
    quote: string;
    author: string | null;
    is_published: boolean;
};
type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: string;
};

type Props = {
    auth: Auth;
    posts: Post[];
    reviews: Review[];
    quotes: Quote[];
    contacts: Contact[];
};

type PostForm = {
    title: string;
    category: string;
    destination: string;
    excerpt: string;
    content: string;
    starts_at: string;
    ends_at: string;
    price: string;
    is_published: boolean;
    cover_image: File | null;
    video_file: File | null;
};

export default function ContentAdmin() {
    const { posts, reviews, quotes, contacts } = usePage<Props>().props;
    const postForm = useForm<PostForm>({
        title: '',
        category: 'upcoming',
        destination: '',
        excerpt: '',
        content: '',
        starts_at: '',
        ends_at: '',
        price: '',
        is_published: true,
        cover_image: null,
        video_file: null,
    });
    const reviewForm = useForm({
        author_name: '',
        destination: '',
        rating: 5,
        content: '',
        is_published: true,
        photo: null as File | null,
        video_file: null as File | null,
    });
    const quoteForm = useForm({ quote: '', author: '', is_published: true });
    const contactCount = contacts.filter(
        (contact) => contact.status === 'new',
    ).length;

    function submitPost(event: FormEvent) {
        event.preventDefault();
        postForm.post('/admin/contenido/viajes', {
            forceFormData: true,
            onSuccess: () => postForm.reset(),
        });
    }

    function submitReview(event: FormEvent) {
        event.preventDefault();
        reviewForm.post('/admin/contenido/resenas', {
            forceFormData: true,
            onSuccess: () => reviewForm.reset(),
        });
    }

    function submitQuote(event: FormEvent) {
        event.preventDefault();
        quoteForm.post('/admin/contenido/frases', {
            onSuccess: () => quoteForm.reset(),
        });
    }

    return (
        <>
            <Head title="Contenido de viajes" />
            <div className="content-admin">
                <header className="content-admin__hero">
                    <div>
                        <p className="content-admin__eyebrow">
                            Panel de agencia
                        </p>
                        <h1>Publica experiencias que inspiren</h1>
                        <p>
                            Gestiona próximos viajes, promociones, recuerdos,
                            reseñas, frases y consultas desde un solo lugar.
                        </p>
                    </div>
                    <div className="content-admin__counter">
                        <strong>{contactCount}</strong>
                        <span>mensajes nuevos</span>
                    </div>
                </header>

                <section className="content-admin__grid">
                    <article className="content-card content-card--wide">
                        <h2>Nuevo viaje, promoción u oferta</h2>
                        <form onSubmit={submitPost} className="content-form">
                            <div className="content-form__row">
                                <label>
                                    Título
                                    <input
                                        value={postForm.data.title}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                </label>
                                <label>
                                    Tipo
                                    <select
                                        value={postForm.data.category}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'category',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="upcoming">
                                            Próximo viaje
                                        </option>
                                        <option value="past">
                                            Viaje realizado
                                        </option>
                                        <option value="promotion">
                                            Promoción
                                        </option>
                                        <option value="offer">Oferta</option>
                                        <option value="combo">Combo</option>
                                    </select>
                                </label>
                            </div>
                            <div className="content-form__row">
                                <label>
                                    Destino
                                    <input
                                        value={postForm.data.destination}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'destination',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </label>
                                <label>
                                    Precio
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={postForm.data.price}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'price',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <div className="content-form__row">
                                <label>
                                    Inicio
                                    <input
                                        type="date"
                                        value={postForm.data.starts_at}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'starts_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </label>
                                <label>
                                    Fin
                                    <input
                                        type="date"
                                        value={postForm.data.ends_at}
                                        onChange={(e) =>
                                            postForm.setData(
                                                'ends_at',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <label>
                                Resumen
                                <textarea
                                    rows={2}
                                    value={postForm.data.excerpt}
                                    onChange={(e) =>
                                        postForm.setData(
                                            'excerpt',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label>
                                Descripción completa
                                <textarea
                                    rows={5}
                                    value={postForm.data.content}
                                    onChange={(e) =>
                                        postForm.setData(
                                            'content',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </label>
                            <div className="content-form__row">
                                <label>
                                    Foto principal
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            postForm.setData(
                                                'cover_image',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                </label>
                                <label>
                                    Video
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) =>
                                            postForm.setData(
                                                'video_file',
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                    />
                                </label>
                            </div>
                            <label className="content-check">
                                <input
                                    type="checkbox"
                                    checked={postForm.data.is_published}
                                    onChange={(e) =>
                                        postForm.setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                />{' '}
                                Publicar ahora
                            </label>
                            <button disabled={postForm.processing}>
                                Guardar publicación
                            </button>
                        </form>
                    </article>

                    <article className="content-card">
                        <h2>Nueva reseña</h2>
                        <form onSubmit={submitReview} className="content-form">
                            <label>
                                Nombre del viajero
                                <input
                                    value={reviewForm.data.author_name}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'author_name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Destino
                                <input
                                    value={reviewForm.data.destination}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'destination',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label>
                                Calificación
                                <select
                                    value={reviewForm.data.rating}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'rating',
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    <option value={5}>5 estrellas</option>
                                    <option value={4}>4 estrellas</option>
                                    <option value={3}>3 estrellas</option>
                                    <option value={2}>2 estrellas</option>
                                    <option value={1}>1 estrella</option>
                                </select>
                            </label>
                            <label>
                                Reseña
                                <textarea
                                    rows={5}
                                    value={reviewForm.data.content}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'content',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Foto
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'photo',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                            </label>
                            <label>
                                Video
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'video_file',
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                />
                            </label>
                            <label className="content-check">
                                <input
                                    type="checkbox"
                                    checked={reviewForm.data.is_published}
                                    onChange={(e) =>
                                        reviewForm.setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                />{' '}
                                Mostrar públicamente
                            </label>
                            <button disabled={reviewForm.processing}>
                                Guardar reseña
                            </button>
                        </form>
                    </article>

                    <article className="content-card">
                        <h2>Nueva frase de empresa</h2>
                        <form onSubmit={submitQuote} className="content-form">
                            <label>
                                Frase
                                <textarea
                                    rows={4}
                                    value={quoteForm.data.quote}
                                    onChange={(e) =>
                                        quoteForm.setData(
                                            'quote',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Autor o firma
                                <input
                                    value={quoteForm.data.author}
                                    onChange={(e) =>
                                        quoteForm.setData(
                                            'author',
                                            e.target.value,
                                        )
                                    }
                                />
                            </label>
                            <label className="content-check">
                                <input
                                    type="checkbox"
                                    checked={quoteForm.data.is_published}
                                    onChange={(e) =>
                                        quoteForm.setData(
                                            'is_published',
                                            e.target.checked,
                                        )
                                    }
                                />{' '}
                                Mostrar públicamente
                            </label>
                            <button disabled={quoteForm.processing}>
                                Guardar frase
                            </button>
                        </form>
                    </article>
                </section>

                <section className="content-card">
                    <div className="content-card__heading">
                        <h2>Publicaciones existentes</h2>
                        <a href="/viajes">Ver página pública</a>
                    </div>
                    <div className="content-list">
                        {posts.map((post) => (
                            <div className="content-list__item" key={post.id}>
                                <span>
                                    <strong>{post.title}</strong>
                                    <small>
                                        {post.destination || 'Sin destino'} ·{' '}
                                        {post.category}
                                    </small>
                                </span>
                                <button
                                    className="button--danger"
                                    onClick={() =>
                                        router.delete(
                                            `/admin/contenido/viajes/${post.id}`,
                                        )
                                    }
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="content-admin__grid">
                    <article className="content-card">
                        <h2>Reseñas publicadas</h2>
                        <div className="content-list">
                            {reviews.map((review) => (
                                <div
                                    className="content-list__item"
                                    key={review.id}
                                >
                                    <span>
                                        <strong>
                                            {review.author_name} ·{' '}
                                            {'★'.repeat(review.rating)}
                                        </strong>
                                        <small>{review.content}</small>
                                    </span>
                                    <button
                                        className="button--danger"
                                        onClick={() =>
                                            router.delete(
                                                `/admin/contenido/resenas/${review.id}`,
                                            )
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </article>
                    <article className="content-card">
                        <h2>Frases publicadas</h2>
                        <div className="content-list">
                            {quotes.map((quote) => (
                                <div
                                    className="content-list__item"
                                    key={quote.id}
                                >
                                    <span>
                                        <strong>“{quote.quote}”</strong>
                                        <small>
                                            {quote.author || 'Sin firma'}
                                        </small>
                                    </span>
                                    <button
                                        className="button--danger"
                                        onClick={() =>
                                            router.delete(
                                                `/admin/contenido/frases/${quote.id}`,
                                            )
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </article>
                </section>

                <section className="content-card">
                    <h2>Mensajes de contacto</h2>
                    <div className="content-list">
                        {contacts.map((contact) => (
                            <div
                                className="content-list__item"
                                key={contact.id}
                            >
                                <span>
                                    <strong>
                                        {contact.name} · {contact.email}
                                    </strong>
                                    <small>{contact.message}</small>
                                </span>
                                <div className="content-actions">
                                    {contact.status === 'new' && (
                                        <button
                                            onClick={() =>
                                                router.patch(
                                                    `/admin/contenido/contactos/${contact.id}/leer`,
                                                )
                                            }
                                        >
                                            Marcar leído
                                        </button>
                                    )}
                                    <button
                                        className="button--danger"
                                        onClick={() =>
                                            router.delete(
                                                `/admin/contenido/contactos/${contact.id}`,
                                            )
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
