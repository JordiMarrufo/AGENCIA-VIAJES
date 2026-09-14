import { Form, Head } from '@inertiajs/react';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            <PasskeyVerify
                label="Entrar con llave de acceso"
                loadingLabel="Autenticando…"
                separator="o continúa con tu correo"
            />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="au-form"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="au-field">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="tucorreo@ejemplo.com"
                            />
                            {errors.email && (
                                <p className="au-field__error">{errors.email}</p>
                            )}
                        </div>

                        <div className="au-field">
                            <div className="au-field-top">
                                <label htmlFor="password">Contraseña</label>
                                {canResetPassword && (
                                    <a href={request().url} className="au-forgot">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                placeholder="Tu contraseña"
                            />
                            {errors.password && (
                                <p className="au-field__error">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <label className="au-remember">
                            <input type="checkbox" name="remember" />
                            <span>Recordarme en este equipo</span>
                        </label>

                        <button
                            type="submit"
                            className="tv-btn tv-btn--magenta au-submit"
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && (
                                <span className="au-spinner" aria-hidden="true" />
                            )}
                            {processing ? 'Entrando…' : 'Iniciar sesión'}
                        </button>
                    </>
                )}
            </Form>

            {status && (
                <p className="au-status" role="status">
                    {status}
                </p>
            )}
        </>
    );
}

Login.layout = {
    title: 'Bienvenido de nuevo',
    description:
        'Accede con tu cuenta para administrar tus viajes y contenidos de la agencia.',
};
