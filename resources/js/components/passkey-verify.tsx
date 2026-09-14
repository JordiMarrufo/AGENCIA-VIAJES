import type { UrlMethodPair } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRound } from 'lucide-react';

type Props = {
    routes?: {
        options: UrlMethodPair;
        submit: UrlMethodPair;
    };
    label?: string;
    loadingLabel?: string;
    separator?: string;
};

export default function PasskeyVerify({
    routes,
    label,
    loadingLabel,
    separator,
}: Props = {}) {
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        ...(routes && {
            routes: {
                options: routes.options.url,
                submit: routes.submit.url,
            },
        }),
        onSuccess: (response) => {
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    if (!isSupported) {
        return null;
    }

    return (
        <>
            <div className="au-passkey">
                <button
                    type="button"
                    className="au-passkey__btn"
                    onClick={verify}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span
                            className="au-spinner au-spinner--dark"
                            aria-hidden="true"
                        />
                    ) : (
                        <KeyRound size={18} aria-hidden="true" />
                    )}
                    <span>
                        {isLoading
                            ? (loadingLabel ?? 'Authenticating...')
                            : (label ?? 'Sign in with a passkey')}
                    </span>
                </button>
                {error && (
                    <p className="au-field__error au-passkey__error">{error}</p>
                )}
            </div>

            <div className="au-divider">
                <span>{separator ?? 'Or continue with email'}</span>
            </div>
        </>
    );
}
