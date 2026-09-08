import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    AtSign,
    ExternalLink,
    Mail,
    MailOpen,
    MessageSquareText,
    Phone,
    Trash2,
} from 'lucide-react';
import { destroy, read } from '@/routes/admin/contacts';
import { contacts } from '@/routes/admin';
import { home } from '@/routes';

type ContactRow = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: string;
    read_at: string | null;
    created_at?: string;
};

type Props = {
    contacts: ContactRow[];
};

function fmtFull(value?: string | null): string {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function AdminContacts({ contacts: records }: Props) {
    const [openId, setOpenId] = useState<number | null>(null);

    const markRead = (contact: ContactRow): void => {
        router.patch(read(contact.id).url, {}, { preserveScroll: true });
    };

    const remove = (contact: ContactRow): void => {
        if (window.confirm(`¿Eliminar el mensaje de “${contact.name}”?`)) {
            router.delete(destroy(contact.id).url, { preserveScroll: true });
        }
    };

    const unread = records.filter((c) => c.status !== 'read').length;

    return (
        <>
            <Head title="Contactos" />

            <section className="ad-head">
                <div className="ad-head__inner">
                    <div>
                        <span className="ad-eyebrow">
                            <Mail size={14} aria-hidden="true" />
                            Mensajes recibidos
                        </span>
                        <h1>Contactos</h1>
                        <p>
                            Los mensajes que los visitantes envían desde el formulario de
                            contacto de la web.
                        </p>
                    </div>
                    <div className="ad-toolbar">
                        <Link href={home()} className="tv-btn tv-btn--soft" target="_blank">
                            <ExternalLink size={16} aria-hidden="true" />
                            Ver sitio
                        </Link>
                    </div>
                </div>
            </section>

            <section aria-labelledby="list-heading">
                <div className="ad-sec">
                    <div>
                        <h2 id="list-heading">Mensajes recibidos</h2>
                        <p>
                            {records.length} {records.length === 1 ? 'mensaje' : 'mensajes'} en total
                            {unread > 0 && <> · {unread} sin leer</>}
                        </p>
                    </div>
                </div>

                <div className="ad-panel">
                    {records.length === 0 ? (
                        <div className="ad-empty">
                            <MailOpen size={36} aria-hidden="true" />
                            <p>Aún no hay mensajes de contacto.</p>
                        </div>
                    ) : (
                        <div className="ad-list">
                            {records.map((contact) => {
                                const isUnread = contact.status !== 'read';
                                return (
                                    <div
                                        className={`ad-row ${isUnread ? 'ad-row--unread' : ''}`}
                                        key={contact.id}
                                    >
                                        <div
                                            className="ad-row__avatar"
                                            aria-hidden="true"
                                        >
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ad-row__main">
                                            <div className="ad-row__title">
                                                {contact.name}
                                                {isUnread && (
                                                    <span className="ad-pub ad-pub--off">Sin leer</span>
                                                )}
                                                {!isUnread && (
                                                    <span className="ad-pub ad-pub--on">Leído</span>
                                                )}
                                                <span className="ad-row__meta">
                                                    <Mail size={13} aria-hidden="true" />
                                                    {fmtFull(contact.created_at)}
                                                </span>
                                            </div>
                                            <div className="ad-row__meta">
                                                <span>
                                                    <AtSign size={13} aria-hidden="true" />
                                                    {contact.email}
                                                </span>
                                                {contact.phone && (
                                                    <span>
                                                        <Phone size={13} aria-hidden="true" />
                                                        {contact.phone}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="ad-contact-msg"
                                                onClick={() =>
                                                    setOpenId((prev) =>
                                                        prev === contact.id ? null : contact.id,
                                                    )
                                                }
                                                aria-expanded={openId === contact.id}
                                            >
                                                <MessageSquareText size={14} aria-hidden="true" />
                                                {openId === contact.id
                                                    ? 'Ocultar mensaje'
                                                    : 'Ver mensaje'}
                                            </button>
                                            {openId === contact.id && (
                                                <p className="ad-row__text ad-row__text--msg">
                                                    {contact.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="ad-row__actions">
                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    className="tv-btn tv-btn--xs tv-btn--soft"
                                                    onClick={() => markRead(contact)}
                                                >
                                                    <MailOpen size={13} aria-hidden="true" />
                                                    Marcar leído
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="tv-btn tv-btn--xs tv-btn--danger"
                                                onClick={() => remove(contact)}
                                            >
                                                <Trash2 size={13} aria-hidden="true" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
