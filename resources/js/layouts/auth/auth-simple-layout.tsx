import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Palmtree, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import BrandMark from '@/components/public/brand-mark';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import '../../../css/travel/tokens.css';
import '../../../css/travel/components.css';
import '../../../css/travel/layout.css';
import '../../../css/travel/auth.css';

type Props = AuthLayoutProps & { children: ReactNode };

function WaveDivider() {
    return (
        <svg
            className="au-art__waves"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path
                d="M0,64 C240,110 480,110 720,78 C960,46 1200,46 1440,84 L1440,120 L0,120 Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: Props) {
    return (
        <div className="au-root">
            <aside className="au-art" aria-hidden="true">
                <div className="au-art__inner">
                    <Link href={home()} className="au-art__brand" tabIndex={-1}>
                        <BrandMark size={46} />
                        <span className="pv-brand__name">
                            <strong>Agencia de Viajes</strong>
                            <em>Tu próxima aventura</em>
                        </span>
                    </Link>

                    <div className="au-art__copy">
                        <span className="au-eyebrow">Playas · Océano · Aventura</span>
                        <h2>Tu próxima gran aventura empieza aquí</h2>
                        <p>
                            Descubre destinos de ensueño, paquetes cuidadosamente
                            diseñados y experiencias que recordarás para siempre.
                            Todo en un solo lugar.
                        </p>
                    </div>

                    <ul className="au-art__points">
                        <li>
                            <Plane size={16} aria-hidden="true" />
                            Destinos seleccionados
                        </li>
                        <li>
                            <Palmtree size={16} aria-hidden="true" />
                            Playas y naturaleza
                        </li>
                        <li>
                            <Sparkles size={16} aria-hidden="true" />
                            Experiencias únicas
                        </li>
                        <li>
                            <ShieldCheck size={16} aria-hidden="true" />
                            Reservas seguras
                        </li>
                    </ul>

                    <WaveDivider />
                </div>
            </aside>

            <main className="au-main">
                <div className="au-card">
                    <Link href={home()} className="au-card__brand">
                        <BrandMark size={38} />
                        <span className="pv-brand__name">
                            <strong>Agencia de Viajes</strong>
                            <em>Tu próxima aventura</em>
                        </span>
                    </Link>

                    <header className="au-card__head">
                        <h1>{title}</h1>
                        {description && <p>{description}</p>}
                    </header>

                    {children}
                </div>
            </main>
        </div>
    );
}
