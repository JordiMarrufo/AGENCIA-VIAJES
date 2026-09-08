import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const fallbackAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

function resolveAppName(page: { props: unknown }): string {
    const props = page.props as { site?: { name?: string | null } };
    const siteName = props.site?.name?.trim();

    return siteName || fallbackAppName;
}

void createInertiaApp({
    title: (title, page) => {
        const appName = resolveAppName(page);

        return title ? `${title} - ${appName}` : appName;
    },
    layout: (name) => {
        switch (true) {
            case name === 'home':
            case name === 'travel-content':
            case name === 'travel-detail':
                return PublicLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name === 'dashboard':
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#E129A1',
    },
});

// This will set light / dark mode on load...
initializeTheme();
