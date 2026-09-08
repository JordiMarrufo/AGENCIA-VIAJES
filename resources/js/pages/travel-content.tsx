import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import '../../css/travel-content.css';

type Post = {
    id: number;
    title: string;
    category: string;
    destination: string | null;
    excerpt: string | null;
    content: string;
    price: string | null;
    cover_image_url?: string | null;
};
type Review = {
    id: number;
    author_name: string;
    destination: string | null;
    rating: number;
    content: string;
};
type Quote = { id: number; quote: string; author: string | null };

export default function TravelContent({
    posts,
    reviews,
    quotes,
}: {
    posts: Post[];
    reviews: Review[];
    quotes: Quote[];
}) {
    const form = useForm({ name: '', email: '', phone: '', message: '' });
    function submit(event: FormEvent) {
        event.preventDefault();
        form.post('/contacto', { onSuccess: () => form.reset() });
    }
    return (
        <>
            <Head title="Viajes y experiencias" />
            <main className="travel-page">
                <header className="travel-page__hero">
                    <p>Agencia de viajes</p>
                    <h1>Viaja, descubre y crea recuerdos</h1>
                    <span>
                        Próximos destinos, promociones y experiencias
                        compartidas.
                    </span>
                    <Link href="/">Volver al inicio</Link>
                </header>
                <section className="travel-page__section">
                    <h2>Viajes y promociones</h2>
                    <div className="travel-grid">
                        {posts.map((post) => (
                            <article className="travel-card" key={post.id}>
                                {post.cover_image_url && (
                                    <img
                                        src={post.cover_image_url}
                                        alt={post.title}
                                    />
                                )}
                                <div>
                                    <small>
                                        {post.category} · {post.destination}
                                    </small>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt || post.content}</p>
                                    {post.price && (
                                        <strong>Desde ${post.price}</strong>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="travel-page__section">
                    <h2>Lo que dicen nuestros viajeros</h2>
                    <div className="travel-grid">
                        {reviews.map((review) => (
                            <article
                                className="travel-card travel-card--review"
                                key={review.id}
                            >
                                <small>
                                    {'★'.repeat(review.rating)} ·{' '}
                                    {review.destination}
                                </small>
                                <p>“{review.content}”</p>
                                <strong>{review.author_name}</strong>
                            </article>
                        ))}
                    </div>
                </section>
                <section className="travel-page__section travel-page__quotes">
                    {quotes.map((quote) => (
                        <blockquote key={quote.id}>
                            “{quote.quote}”<cite>{quote.author}</cite>
                        </blockquote>
                    ))}
                </section>
                <section className="travel-page__section contact-panel">
                    <h2>¿Listo para tu próximo viaje?</h2>
                    <form onSubmit={submit} className="contact-form">
                        <input
                            placeholder="Nombre"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            required
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            required
                        />
                        <input
                            placeholder="Teléfono (opcional)"
                            value={form.data.phone}
                            onChange={(e) =>
                                form.setData('phone', e.target.value)
                            }
                        />
                        <textarea
                            placeholder="Cuéntanos cómo podemos ayudarte"
                            rows={5}
                            value={form.data.message}
                            onChange={(e) =>
                                form.setData('message', e.target.value)
                            }
                            required
                        />
                        <button disabled={form.processing}>
                            Enviar mensaje
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
