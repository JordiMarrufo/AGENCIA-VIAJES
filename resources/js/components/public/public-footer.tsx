import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import SiteBrand from '@/components/site-brand';

const EXPLORE = [
    { label: 'Inicio', href: '/' },
    { label: 'Viajes y promociones', href: '/viajes' },
    { label: 'Próximos viajes', href: '/#proximos' },
    { label: 'Viajes anteriores', href: '/#anteriores' },
];

export default function PublicFooter() {
    const { props } = usePage();
    const year = new Date().getFullYear();
    const siteName = props.site?.name ?? 'Agencia de Viajes';

    return (
        <footer className="pv-footer">
            <div className="tv-container pv-footer__grid">
                <div className="pv-footer__brand">
                    <SiteBrand href="/" className="pv-footer__logo" ariaLabel={`${siteName} — Inicio`} />
                    <p className="pv-footer__tagline">
                        Diseñamos experiencias de viaje entre el mar, los ríos y los
                        bosques para que solo te preocupes de disfrutar cada destino.
                    </p>
                    <MapPin size={20} className="pv-footer__wave" aria-hidden="true" />
                </div>

                <nav aria-label="Explorar">
                    <h3>Explorar</h3>
                    <ul className="pv-footer__links">
                        {EXPLORE.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h3>Contacto</h3>
                    <div className="pv-footer__contact">
                        <span>
                            Cuéntanos qué tipo de viaje buscas y te enviaremos
                            propuestas a tu medida.
                        </span>
                        <Link href="/viajes#contacto" className="pv-cta" style={{ alignSelf: 'flex-start' }}>
                            Escribirnos
                            <ArrowRight size={16} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="pv-footer__bottom">
                <div className="tv-container pv-footer__legal">
                    <span>© {year} {siteName}. Todos los derechos reservados.</span>
                    <span>Playas · Ríos · Mares · Bosques</span>
                </div>
            </div>
        </footer>
    );
}
