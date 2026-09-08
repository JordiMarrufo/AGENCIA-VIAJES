import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import BrandMark from '@/components/public/brand-mark';

const NAV = [
    { label: 'Inicio', href: '/', anchor: false },
    { label: 'Viajes', href: '/viajes', anchor: false },
    { label: 'Contacto', href: '/viajes#contacto', anchor: true },
] as const;

export default function PublicHeader() {
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    const path = url.split('?')[0];

    const isActive = (item: (typeof NAV)[number]): boolean => {
        if (item.anchor) {
            return false;
        }
        if (item.href === '/') {
            return path === '/';
        }
        return path === item.href || path.startsWith(`${item.href}/`);
    };

    return (
        <header className="pv-header">
            <div className="tv-container pv-header__inner">
                <Link href="/" className="pv-brand" aria-label="Agencia de Viajes — Inicio">
                    <BrandMark />
                    <span className="pv-brand__name">
                        <strong>Agencia de Viajes</strong>
                        <em>Playa · Mar · Naturaleza</em>
                    </span>
                </Link>

                <nav className="pv-nav" aria-label="Principal">
                    {NAV.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`pv-nav__link${isActive(item) ? ' is-active' : ''}`}
                            aria-current={isActive(item) ? 'page' : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pv-actions">
                    <Link href="/viajes#contacto" className="pv-cta">
                        Reservar viaje
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <button
                        type="button"
                        className="pv-burger"
                        aria-expanded={open}
                        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
            <div className="pv-header__ribbon" aria-hidden="true" />

            {open && (
                <nav className="pv-mobile is-open" aria-label="Menú móvil">
                    {NAV.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`pv-mobile__link${isActive(item) ? ' is-active' : ''}`}
                            aria-current={isActive(item) ? 'page' : undefined}
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/viajes#contacto"
                        className="pv-cta pv-mobile__cta"
                        onClick={() => setOpen(false)}
                    >
                        Reservar viaje
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                </nav>
            )}
        </header>
    );
}
