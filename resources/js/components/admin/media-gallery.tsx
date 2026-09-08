import { useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Film,
    ImagePlus,
    Trash2,
    Upload,
} from 'lucide-react';

export type MediaEntry = {
    id: string;
    kind: 'image' | 'video';
    url?: string | null;
    file?: File | null;
    name: string;
};

type Props = {
    id: string;
    kind: 'image' | 'video';
    label: string;
    hint: string;
    accept: string;
    entries: MediaEntry[];
    onChange: (entries: MediaEntry[]) => void;
};

let galleryCounter = 0;

const nextId = (kind: 'image' | 'video'): string =>
    `${kind}-${Date.now()}-${galleryCounter++}`;

/**
 * Administrador de galería múltiple: permite arrastrar o elegir varios
 * archivos, reordenar con flechas y quitar elementos individuales.
 */
export default function MediaGallery({
    id,
    kind,
    label,
    hint,
    accept,
    entries,
    onChange,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [over, setOver] = useState(false);
    const max = kind === 'image' ? 100 : 10;
    const isImage = kind === 'image';

    const revoke = (entry: MediaEntry): void => {
        if (entry.file && entry.url) {
            URL.revokeObjectURL(entry.url);
        }
    };

    const addFiles = (list: FileList | File[] | null): void => {
        const files = Array.from(list ?? []);
        if (files.length === 0) {
            return;
        }
        const space = max - entries.length;
        const added = files.slice(0, Math.max(space, 0)).map((file) => {
            const url = URL.createObjectURL(file);

            return { id: nextId(kind), kind, url, file, name: file.name };
        });
        if (added.length) {
            onChange([...entries, ...added]);
        }
    };

    const removeAt = (index: number): void => {
        revoke(entries[index]);
        onChange(entries.filter((_, i) => i !== index));
    };

    const move = (index: number, dir: -1 | 1): void => {
        const target = index + dir;
        if (target < 0 || target >= entries.length) {
            return;
        }
        const next = [...entries];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const openPicker = (): void => {
        inputRef.current?.click();
    };

    return (
        <div className="ag">
            <div className="ag__meta">
                <strong>{label}</strong>
                <span className="ag__count">
                    {entries.length} / {max}
                </span>
            </div>

            {entries.length > 0 && (
                <ul className="ag__list">
                    {entries.map((entry, index) => (
                        <li className="ag__item" key={entry.id}>
                            {isImage && entry.url ? (
                                <img src={entry.url} alt={entry.name} />
                            ) : (
                                <span className="ag__video">
                                    <Film size={26} aria-hidden="true" />
                                    <small>{entry.name}</small>
                                </span>
                            )}

                            <span className="ag__tools">
                                <button
                                    type="button"
                                    className="ag__tool"
                                    title="Mover antes"
                                    aria-label="Mover antes"
                                    disabled={index === 0}
                                    onClick={() => move(index, -1)}
                                >
                                    <ChevronLeft size={15} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="ag__tool"
                                    title="Mover después"
                                    aria-label="Mover después"
                                    disabled={index === entries.length - 1}
                                    onClick={() => move(index, 1)}
                                >
                                    <ChevronRight size={15} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="ag__tool ag__tool--danger"
                                    title="Quitar de la galería"
                                    aria-label="Quitar de la galería"
                                    onClick={() => removeAt(index)}
                                >
                                    <Trash2 size={15} aria-hidden="true" />
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {entries.length >= max ? (
                <p className="ag__limit">Llegaste al máximo de {max} archivos.</p>
            ) : (
                <div
                    className={`ag__drop ${over ? 'is-over' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${hint}. Pulsa para elegir archivos.`}
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
                        addFiles(e.dataTransfer.files);
                    }}
                >
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        className="ag__input"
                        accept={accept}
                        multiple
                        tabIndex={-1}
                        onChange={(e) => addFiles(e.target.files)}
                    />
                    <span className="ag__drop-ico" aria-hidden="true">
                        {isImage ? <ImagePlus size={24} /> : <Film size={24} />}
                    </span>
                    <span className="ag__drop-text">
                        <strong>{hint}</strong>
                        <small>
                            {isImage
                                ? 'JPG, PNG o WEBP · hasta 5 MB por foto'
                                : 'mp4, webm o mov · hasta 50 MB por video'}
                        </small>
                    </span>
                    <span className="tv-btn tv-btn--xs tv-btn--soft">
                        <Upload size={13} aria-hidden="true" />
                        {isImage ? 'Elegir fotos' : 'Elegir videos'}
                    </span>
                </div>
            )}
        </div>
    );
}
