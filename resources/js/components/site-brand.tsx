import { Link, usePage } from '@inertiajs/react';
import BrandMark from '@/components/public/brand-mark';
import type { SiteProps } from '@/types/site';

const FALLBACK: SiteProps = {
    name: 'Agencia de Viajes',
    tagline: 'Playa · Mar · Naturaleza',
    logo_url: null,
    has_logo: false,
};

type SiteBrandProps = {
    href: string;
    className?: string;
    logoSize?: number;
    /** Texto bajo el nombre. undefined → usa el eslogan del sitio; null → oculta la línea. */
    subtitle?: string | null;
    ariaLabel?: string;
};

export default function SiteBrand({
    href,
    className = '',
    logoSize = 46,
    subtitle,
    ariaLabel,
}: SiteBrandProps) {
    const { props } = usePage();
    const site: SiteProps = { ...FALLBACK, ...(props.site ?? {}) };
    const emText = subtitle === undefined ? site.tagline : subtitle;

    return (
        <Link
            href={href}
            className={className}
            aria-label={ariaLabel ?? `${site.name} — Inicio`}
        >
            {site.has_logo && site.logo_url ? (
                <img
                    className="pv-brand__logo"
                    src={site.logo_url}
                    alt=""
                    width={logoSize}
                    height={logoSize}
                    style={{ width: logoSize, height: logoSize }}
                />
            ) : (
                <BrandMark size={logoSize} />
            )}
            <span className="pv-brand__name">
                <strong>{site.name}</strong>
                {emText ? <em>{emText}</em> : null}
            </span>
        </Link>
    );
}
