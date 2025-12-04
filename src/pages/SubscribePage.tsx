import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
    firstName: string;
    lastName: string;
    login: string;
    birthDate: string;
    password: string;
}

export default function SubscribePage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<FormData>({
        firstName: '',
        lastName: '',
        login: '',
        birthDate: '',
        password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Ref pour focus automatique sur le premier champ
    const firstInputRef = useRef<HTMLInputElement>(null);
    // Ref pour focus sur l'erreur
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (error) errorRef.current?.focus();
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        if (form.birthDate > today) {
            setError("La date de naissance ne peut pas être dans le futur.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.status === 201) {
                navigate('/login');
            } else if (res.status === 400) {
                setError("Les champs sont invalides. Vérifiez votre saisie.");
            } else if (res.status === 409) {
                setError("Ce login est déjà utilisé.");
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
                aria-labelledby="subscribe-title"
                aria-describedby={error ? 'subscribe-error' : undefined}
            >
                <h1 id="subscribe-title" className="text-2xl font-bold mb-4">
                    Inscription
                </h1>

                {error && (
                    <div
                        ref={errorRef}
                        id="subscribe-error"
                        role="alert"
                        tabIndex={-1} // permet focus clavier
                        aria-live="assertive"
                        className="mb-4 text-red-700 bg-red-100 p-2 rounded"
                    >
                        {error}
                    </div>
                )}

                {/* First Name */}
                <div className="mb-4">
                    <label htmlFor="firstName" className="block font-medium mb-1">
                        Prénom
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        ref={firstInputRef}
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        aria-invalid={!!error}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                    <label htmlFor="lastName" className="block font-medium mb-1">
                        Nom de famille
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        aria-invalid={!!error}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Email / Login */}
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
                        aria-invalid={!!error}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Birth Date */}
                <div className="mb-4">
                    <label htmlFor="birthDate" className="block font-medium mb-1">
                        Date de naissance
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                        aria-invalid={!!error}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Password */}
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
                        minLength={6}
                        aria-invalid={!!error}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>
        </main>
    );
}
