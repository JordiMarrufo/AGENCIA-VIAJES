import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, Eye, ExternalLink, ImagePlus, Palette, RefreshCw, Upload, X } from 'lucide-react';
import { settings } from '@/routes/admin';
import { update } from '@/routes/admin/settings';
import { home } from '@/routes';
import BrandMark from '@/components/public/brand-mark';

type SettingsData = {
    site_name: string;
    site_tagline: string | null;
    logo_url: string | null;
};

type Props = {
    settings: SettingsData;
    errors?: Record<string, string>;
};

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';
const IMAGE_HINT = 'PNG, JPG o WEBP · máx. 5 MB';

export default function AdminSite({ settings: site, errors = {} }: Props) {
    const { props } = usePage();
    const pageErrors = (props.errors ?? errors) as Record<string, string>;
    const errorList = Object.values(pageErrors);

    const [name, setName] = useState(site.site_name);
    const [tagline, setTagline] = useState(site.site_tagline ?? '');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [removeLogo, setRemoveLogo] = useState(false);
    const [busy, setBusy] = useState(false);

    const logoInput = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [over, setOver] = useState(false);

    useEffect(() => {
        if (!logoFile) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(logoFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [logoFile]);

    const hasStoredLogo = Boolean(site.logo_url);
    const hasLogo = Boolean(logoFile ? previewUrl : hasStoredLogo);
    const logoSource = logoFile ? previewUrl : site.logo_url;

    const pickLogo = (file: File | null): void => {
        setLogoFile(file);
        if (file) {
            setRemoveLogo(false);
        }
    };

    const openPicker = (): void => {
        logoInput.current?.click();
    };

    const submit = (): void => {
        const payload: Record<string, string | boolean | File> = {
            site_name: name,
        };
        if (tagline.trim()) {
            payload.site_tagline = tagline.trim();
        }
        if (logoFile) {
            payload.logo = logoFile;
        } else if (removeLogo) {
            payload.remove_logo = true;
        }

        setBusy(true);
        router.post(update().url, payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setBusy(false);
                setLogoFile(null);
                setRemoveLogo(false);
            },
            onError: () => setBusy(false),
        });
    };

    const reset = (): void => {
        setName(site.site_name);
        setTagline(site.site_tagline ?? '');
        setLogoFile(null);
        setRemoveLogo(false);
    };

    const previewName = name.trim() || 'Nombre del sitio';
    const previewTagline = tagline.trim();

    return (
        <>
            <Head title="Sitio" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <Palette size={14} aria-hidden="true" />
                            Personalización
                        </span>
                        <h1>Configuración del sitio</h1>
                        <p>
                            Cambia el nombre y el logo que aparecen en el encabezado de tu
                            página. Los ajustes se reflejan al instante en todo el sitio.
                        </p>
                    </div>
                    <div className="ad-toolbar">
                        <Link href={home().url} className="tv-btn tv-btn--soft" target="_blank">
                            <ExternalLink size={16} aria-hidden="true" />
                            Ver sitio
                        </Link>
                    </div>
                </div>
            </section>

            <section className="ad-panel ad-panel--edit" aria-label="Ajustes del encabezado">
                <div className="ad-panel__head ad-panel__head--edit">
                    <div>
                        <h2>Identidad del encabezado</h2>
                        <p className="ad-panel__sub">
                            Nombre, eslogan y logo que distinguen tu agencia de viajes.
                        </p>
                    </div>
                </div>

                <div className="ad-panel__body">
                    {errorList.length > 0 && (
                        <div className="ad-form__error" style={{ marginBottom: '1.4rem' }}>
                            {errorList.map((message) => (
                                <div key={message}>{message}</div>
                            ))}
                        </div>
                    )}

                    <div className="ad-edit">
                        <div className="ad-edit__main">
                            <section className="ad-fs" aria-label="Nombre y logo">
                                <header className="ad-fs__head">
                                    <span className="ad-fs__ico ad-fs__ico--magenta">
                                        <Palette size={18} aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3>Nombre y logo</h3>
                                        <p>Se muestran a la izquierda, arriba en cada página.</p>
                                    </div>
                                </header>

                                <div className="ad-fs__body">
                                    <div className="tv-form">
                                        <div className="tv-field ad-span">
                                            <label htmlFor="site-name">Nombre del encabezado *</label>
                                            <input
                                                id="site-name"
                                                type="text"
                                                value={name}
                                                maxLength={120}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Ej. Agencia de Viajes"
                                            />
                                        </div>

                                        <div className="tv-field ad-span">
                                            <label htmlFor="site-tagline">Eslogan</label>
                                            <input
                                                id="site-tagline"
                                                type="text"
                                                value={tagline}
                                                maxLength={180}
                                                onChange={(e) => setTagline(e.target.value)}
                                                placeholder="Ej. Playa · Mar · Naturaleza"
                                            />
                                        </div>

                                        <div className="tv-field ad-span">
                                            <label htmlFor="site-logo">Logo del encabezado</label>
                                            <div className="ad-logo">
                                                <div
                                                    className={[
                                                        'ad-logo__zone',
                                                        removeLogo && !logoFile ? 'is-removed' : '',
                                                        over ? 'is-over' : '',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' ')}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-label="Logo del sitio: arrastra una imagen o pulsa para elegir"
                                                    onClick={openPicker}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            openPicker();
                                                        }
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        e.dataTransfer.dropEffect = 'copy';
                                                        setOver(true);
                                                    }}
                                                    onDragLeave={() => setOver(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setOver(false);
                                                        pickLogo(e.dataTransfer.files?.[0] ?? null);
                                                    }}
                                                >
                                                    <input
                                                        ref={logoInput}
                                                        id="site-logo"
                                                        type="file"
                                                        className="ad-logo__input"
                                                        accept={IMAGE_ACCEPT}
                                                        tabIndex={-1}
                                                        onChange={(e) => pickLogo(e.target.files?.[0] ?? null)}
                                                    />
                                                    {logoFile && previewUrl ? (
                                                        <>
                                                            <img
                                                                className="ad-logo__preview"
                                                                src={previewUrl}
                                                                alt="Vista previa del nuevo logo"
                                                                draggable={false}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="ad-drop__clear"
                                                                title="Quitar la imagen nueva"
                                                                aria-label="Quitar la imagen nueva elegida"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    pickLogo(null);
                                                                }}
                                                            >
                                                                <X size={15} aria-hidden="true" />
                                                            </button>
                                                        </>
                                                    ) : hasStoredLogo && !removeLogo ? (
                                                        <img
                                                            className="ad-logo__preview"
                                                            src={site.logo_url ?? ''}
                                                            alt="Logo actual del sitio"
                                                            draggable={false}
                                                        />
                                                    ) : (
                                                        <span className="ad-logo__empty">
                                                            <ImagePlus size={26} aria-hidden="true" />
                                                            <span>
                                                                {removeLogo
                                                                    ? 'Sin logo'
                                                                    : 'Arrastra el logo aquí'}
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="ad-logo__meta">
                                                    <strong>
                                                        {logoFile
                                                            ? logoFile.name
                                                            : removeLogo
                                                              ? 'Sin logo'
                                                              : hasStoredLogo
                                                                ? 'Logo actual'
                                                                : 'Aún no hay logo'}
                                                    </strong>
                                                    <p>
                                                        {removeLogo && !logoFile
                                                            ? 'Se guardará el símbolo por defecto de la agencia.'
                                                            : 'Se recomienda un cuadrado con fondo blanco o transparente. ' +
                                                              IMAGE_HINT}
                                                    </p>
                                                    <div className="ad-logo__actions">
                                                        <button
                                                            type="button"
                                                            className="tv-btn tv-btn--sm tv-btn--soft"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                openPicker();
                                                            }}
                                                        >
                                                            <Upload size={14} aria-hidden="true" />
                                                            {hasLogo || removeLogo ? 'Cambiar' : 'Subir logo'}
                                                        </button>
                                                        {(hasLogo || removeLogo) && (
                                                            <button
                                                                type="button"
                                                                className="tv-btn tv-btn--sm tv-btn--danger"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (logoFile) {
                                                                        pickLogo(null);
                                                                    }
                                                                    if (hasStoredLogo) {
                                                                        setRemoveLogo(true);
                                                                    }
                                                                }}
                                                            >
                                                                Quitar logo
                                                            </button>
                                                        )}
                                                        {removeLogo && !logoFile && (
                                                            <button
                                                                type="button"
                                                                className="tv-btn tv-btn--sm tv-btn--soft"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setRemoveLogo(false);
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="ad-edit__foot">
                                <p className="ad-site-note">
                                    Los cambios se publican de inmediato en el encabezado de
                                    todas las páginas.
                                </p>
                                <div className="ad-edit__actions">
                                    <button type="button" className="tv-btn tv-btn--soft" onClick={reset}>
                                        Restablecer
                                    </button>
                                    <button
                                        type="button"
                                        className="tv-btn tv-btn--magenta"
                                        onClick={submit}
                                        disabled={busy}
                                    >
                                        {busy ? (
                                            <RefreshCw size={16} aria-hidden="true" className="ad-spin" />
                                        ) : (
                                            <Check size={16} aria-hidden="true" />
                                        )}
                                        {busy ? 'Guardando…' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </footer>
                        </div>

                        <aside className="ad-edit__side">
                            <div className="ad-edit__preview">
                                <header className="ad-edit__preview-head">
                                    <span className="ad-edit__preview-ico">
                                        <Eye size={16} aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h3>Vista previa del encabezado</h3>
                                        <p>Así se verá arriba en tu página.</p>
                                    </div>
                                </header>
                                <div className="ad-edit__preview-stage ad-site-stage">
                                    <div className="ad-site-stage__bar">
                                        <span className="ad-site-stage__logo">
                                            {logoSource && !removeLogo ? (
                                                <img src={logoSource} alt="" draggable={false} />
                                            ) : (
                                                <BrandMark size={40} />
                                            )}
                                        </span>
                                        <span className="ad-site-stage__brand">
                                            <strong>{previewName}</strong>
                                            {previewTagline ? <em>{previewTagline}</em> : null}
                                        </span>
                                    </div>
                                    <div className="ad-site-stage__ribbon" aria-hidden="true" />
                                    <div className="ad-site-stage__nav" aria-hidden="true">
                                        <span>Inicio</span>
                                        <span>Viajes</span>
                                        <span>Contacto</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </>
    );
}
