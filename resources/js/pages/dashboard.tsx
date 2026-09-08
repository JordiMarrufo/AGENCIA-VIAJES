import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    ExternalLink,
    Eye,
    Inbox,
    LayoutDashboard,
    Mail,
    MessageSquareQuote,
    Plane,
    Star,
} from 'lucide-react';
import { contacts, posts, quotes, reviews } from '@/routes/admin';
import { home } from '@/routes';
import type { Auth } from '@/types';

type Stats = {
    posts: number;
    postsUpcoming: number;
    postsPast: number;
    postsPublished: number;
    reviews: number;
    reviewsPublished: number;
    quotes: number;
    contacts: number;
    contactsUnread: number;
};

type Props = {
    stats: Stats;
    isAdmin: boolean;
};

type StatCard = {
    label: string;
    value: number;
    icon: typeof Plane;
    tone: 'mar' | 'rio' | 'bosque' | 'magenta';
    href: string;
};

export default function Dashboard({ stats, isAdmin }: Props) {
    const { props } = usePage<{ auth: Auth }>();
    const user = props.auth?.user;

    const statCards: StatCard[] = [
        { label: 'Viajes', value: stats.posts, icon: Plane, tone: 'mar', href: posts().url },
        {
            label: 'Próximos viajes',
            value: stats.postsUpcoming,
            icon: CalendarClock,
            tone: 'rio',
            href: posts().url,
        },
        {
            label: 'Viajes publicados',
            value: stats.postsPublished,
            icon: Eye,
            tone: 'bosque',
            href: posts().url,
        },
        { label: 'Reseñas', value: stats.reviews, icon: Star, tone: 'magenta', href: reviews().url },
        {
            label: 'Reseñas publicadas',
            value: stats.reviewsPublished,
            icon: CheckCircle2,
            tone: 'rio',
            href: reviews().url,
        },
        { label: 'Frases', value: stats.quotes, icon: MessageSquareQuote, tone: 'bosque', href: quotes().url },
        { label: 'Contactos', value: stats.contacts, icon: Inbox, tone: 'mar', href: contacts().url },
        {
            label: 'Sin leer',
            value: stats.contactsUnread,
            icon: Mail,
            tone: 'magenta',
            href: contacts().url,
        },
    ];

    const crudCards = [
        {
            title: 'Viajes y paquetes',
            text: 'Crea, edita y publica los viajes del home: próximos y pasados.',
            icon: Plane,
            tone: 'magenta',
            href: posts(),
            go: 'Gestionar viajes',
        },
        {
            title: 'Reseñas',
            text: 'Administra las opiniones que aparecen en la página principal.',
            icon: Star,
            tone: 'rio',
            href: reviews(),
            go: 'Gestionar reseñas',
        },
        {
            title: 'Frases',
            text: 'Mantén las frases inspiradoras que dan voz a la agencia.',
            icon: MessageSquareQuote,
            tone: 'bosque',
            href: quotes().url,
            go: 'Gestionar frases',
        },
        {
            title: 'Contactos',
            text: 'Consulta los mensajes recibidos desde el formulario de contacto.',
            icon: Inbox,
            tone: 'mar',
            href: contacts().url,
            go: 'Ver mensajes',
        },
    ];

    return (
        <>
            <Head title="Panel de administración" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <LayoutDashboard size={14} aria-hidden="true" />
                            Panel de administración
                        </span>
                        <h1>Hola, {user?.name?.split(' ')[0] ?? 'viajero'} 👋</h1>
                        <p>
                            Administra el contenido de la agencia de viajes: los
                            destinos, las reseñas de tus clientes y los mensajes de
                            contacto. Todo con el mismo estilo de tu web.
                        </p>
                    </div>
                    <Link href={home()} className="tv-btn tv-btn--soft" target="_blank">
                        <ExternalLink size={16} aria-hidden="true" />
                        Ver el sitio
                    </Link>
                </div>
            </section>

            <section className="ad-stats" aria-label="Resumen de contenido">
                {statCards.map(({ label, value, icon: Icon, tone, href }) => (
                    <Link key={label} href={href} className="ad-stat">
                        <span className={`ad-stat__icon ad-stat__icon--${tone}`}>
                            <Icon aria-hidden="true" />
                        </span>
                        <span className="ad-stat__num">{value}</span>
                        <span className="ad-stat__label">{label}</span>
                    </Link>
                ))}
            </section>

            {isAdmin && (
                <section aria-labelledby="crud-heading">
                    <div className="ad-sec">
                        <div>
                            <h2 id="crud-heading">Secciones del sitio</h2>
                            <p>
                                Cada sección tiene su propio administrador para
                                mantener todo ordenado.
                            </p>
                        </div>
                    </div>

                    <div className="ad-crud-grid">
                        {crudCards.map(({ title, text, icon: Icon, tone, href, go }) => (
                            <Link key={title} href={href} className="ad-crud">
                                <span className={`ad-crud__icon ad-crud__icon--${tone}`}>
                                    <Icon aria-hidden="true" />
                                </span>
                                <span className="ad-crud__main">
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                    <span className="ad-crud__go">
                                        {go}
                                        <ArrowRight size={15} aria-hidden="true" />
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
