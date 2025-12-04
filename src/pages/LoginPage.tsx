// LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";   // ⬅️ IMPORTANT !

interface LoginForm {
    login: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login: loginUser } = useAuth();   // ⬅️ UTILISATION DU CONTEXTE

    const [form, setForm] = useState<LoginForm>({ login: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.status === 200) {
                const data = await res.json();

                // ⬅️ FIX : UTILISER login() DU CONTEXTE
                loginUser(data.accessToken);

                navigate('/');
            } else if (res.status === 400) {
                setError("Les champs sont invalides. Vérifiez votre saisie.");
            } else if (res.status === 401) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Une erreur est survenue. Réessayez plus tard.");
            }
        } catch {
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded shadow"
                aria-labelledby="login-title"
            >
                <h1 id="login-title" className="text-2xl font-bold mb-4">
                    Connexion
                </h1>

                {error && (
                    <div
                        className="mb-4 text-red-700 bg-red-100 p-2 rounded"
                        role="alert"
                        aria-live="assertive"
                    >
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="login" className="block font-medium mb-1">
                        Adresse email
                    </label>
                    <input
                        type="email"
                        id="login"
                        name="login"
                        value={form.login}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-invalid={!!error}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block font-medium mb-1">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-invalid={!!error}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-busy={loading}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </main>
    );
}
