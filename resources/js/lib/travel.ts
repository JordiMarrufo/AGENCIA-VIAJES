import type { TravelCategory, TravelPostData } from '@/types/travel';

const MONTHS = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const CATEGORY_META: Record<TravelCategory, { label: string; chip: string; tile: string }> = {
    upcoming: { label: 'Próximamente', chip: 'tv-chip--mar', tile: 'pv-tile--rio' },
    past: { label: 'Viajes anteriores', chip: 'tv-chip--rio', tile: 'pv-tile--bosque' },
    promotion: { label: 'Promoción', chip: 'tv-chip--magenta', tile: 'pv-tile--magenta' },
    offer: { label: 'Oferta', chip: 'tv-chip--rio', tile: 'pv-tile--rio' },
    combo: { label: 'Combo', chip: 'tv-chip--bosque', tile: 'pv-tile--bosque' },
};

export function categoryLabel(category: string): string {
    return CATEGORY_META[category as TravelCategory]?.label ?? category;
}

export function categoryChip(category: string): string {
    return CATEGORY_META[category as TravelCategory]?.chip ?? 'tv-chip--mar';
}

export function categoryTile(category: string): string {
    return CATEGORY_META[category as TravelCategory]?.tile ?? 'pv-tile--rio';
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '';
    }
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month) {
        return value;
    }
    return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function dateRangeLabel(start: string | null, end: string | null): string {
    if (!start && !end) {
        return '';
    }
    if (!end) {
        return formatDate(start);
    }
    if (!start) {
        return formatDate(end);
    }
    const sameMonth = start.slice(0, 7) === end.slice(0, 7);
    if (sameMonth) {
        const startDay = Number(start.split('-')[2]);
        return `${startDay} – ${formatDate(end)}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
}

export function nightsLabel(start: string | null, end: string | null): string {
    if (!start || !end) {
        return '';
    }
    const days = Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
    if (days <= 0) {
        return '';
    }
    const nights = Math.max(days - 1, 0);
    return nights > 0 ? `${days} días · ${nights} noches` : `${days} días`;
}

export function priceLabel(price: string | null | undefined): string {
    if (!price) {
        return '';
    }
    const numeric = Number(price);
    if (!Number.isFinite(numeric)) {
        return '';
    }
    const formatted = numeric.toLocaleString('es-MX', {
        minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    });
    return `Desde $${formatted}`;
}

export function isUpcomingPost(post: TravelPostData): boolean {
    return post.category !== 'past';
}
