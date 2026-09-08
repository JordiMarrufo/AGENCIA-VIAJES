import type { ReactNode } from 'react';
import PublicFooter from '@/components/public/public-footer';
import PublicHeader from '@/components/public/public-header';
import '../../css/travel/tokens.css';
import '../../css/travel/layout.css';
import '../../css/travel/components.css';

export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="pv-root">
            <PublicHeader />
            <main id="contenido">{children}</main>
            <PublicFooter />
        </div>
    );
}
