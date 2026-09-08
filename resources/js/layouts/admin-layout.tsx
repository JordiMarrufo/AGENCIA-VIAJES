import type { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Inbox,
    LayoutDashboard,
    LogOut,
    MessageSquareQuote,
    Plane,
    Settings,
    Star,
} from 'lucide-react';
import SiteBrand from '@/components/site-brand';
import { dashboard } from '@/routes';
import { contacts, posts, quotes, reviews, settings } from '@/routes/admin';
import { home, logout } from '@/routes';
import type { Auth } from '@/types';
import '../../css/travel/tokens.css';
import '../../css/travel/layout.css';
import '../../css/travel/components.css';
import '../../css/travel/admin.css';

type NavItem = {
    label: string;
    href: string;
    icon: ReactNode;
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { url, props } = usePage<{ auth: Auth }>();
    const path = url.split('?')[0];

    const nav: NavItem[] = [
        {
            label: 'Panel',
            href: dashboard().url,
            icon: <LayoutDashboard size={17} aria-hidden="true" />,
        },
        {
            label: 'Viajes',
            href: posts().url,
            icon: <Plane size={17} aria-hidden="true" />,
        },
        {
            label: 'Reseñas',
            href: reviews().url,
            icon: <Star size={17} aria-hidden="true" />,
        },
        {
            label: 'Frases',
            href: quotes().url,
            icon: <MessageSquareQuote size={17} aria-hidden="true" />,
        },
        {
            label: 'Contactos',
            href: contacts().url,
            icon: <Inbox size={17} aria-hidden="true" />,
        },
        {
            label: 'Sitio',
            href: settings().url,
            icon: <Settings size={17} aria-hidden="true" />,
        },
    ];

    const isActive = (href: string): boolean =>
        path === href || path.startsWith(`${href}/`);

    const user = props.auth?.user;
    const siteName = (props as { site?: { name?: string } }).site?.name ?? 'Agencia de Viajes';

    return (
        <div className="ad-root">
            <header className="ad-header">
                <div className="tv-container ad-header__inner">
                    <SiteBrand
                        href={dashboard().url}
                        className="pv-brand"
                        logoSize={42}
                        subtitle="Panel de administración"
                        ariaLabel={`${siteName} — Panel de administración`}
                    />

                    <div className="ad-header__right">
                        <nav className="ad-nav" aria-label="Panel de administración">
                            {nav.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`ad-nav__link${
                                        isActive(item.href) ? ' is-active' : ''
                                    }`}
                                    aria-current={isActive(item.href) ? 'page' : undefined}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="ad-actions">
                            <Link href={home()} className="tv-btn tv-btn--sm tv-btn--soft" target="_blank">
                                <ExternalLink size={15} aria-hidden="true" />
                                Ver sitio
                            </Link>
                            <Link
                                href={logout()}
                                as="button"
                                className="tv-btn tv-btn--sm tv-btn--danger"
                                aria-label="Cerrar sesión"
                                title={user ? `Cerrar sesión de ${user.name}` : 'Cerrar sesión'}
                            >
                                <LogOut size={15} aria-hidden="true" />
                                Salir
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="ad-ribbon" aria-hidden="true" />
            </header>

            <main className="ad-main">
                <div className="tv-container ad-body">{children}</div>
            </main>
        </div>
    );
}
