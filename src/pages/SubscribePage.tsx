import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

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
        firstName: "",
        lastName: "",
        login: "",
        birthDate: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [fieldError, setFieldError] = useState(false);
    const [loading, setLoading] = useState(false);

    const firstInputRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (error) errorRef.current?.focus();
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldError(false);

        const today = new Date().toISOString().split("T")[0];
        if (form.birthDate > today) {
            setError("La date de naissance ne peut pas être dans le futur.");
            setFieldError(true);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/subscribe", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            if (res.status === 201) {
                navigate("/login");
            } else if (res.status === 400) {
                setError("Les champs sont invalides. Vérifiez votre saisie.");
                setFieldError(true);
            } else if (res.status === 409) {
                setError("Ce login est déjà utilisé.");
                setFieldError(true);
            } else {
                setError("Une erreur est survenue. Réessayez plus tard.");
            }
        } catch {
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
        }
    };

    const errorId = error ? "subscribe-error" : undefined;

    return (
        <main
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 p-4"
            aria-label="Page d'inscription"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-emerald-950/95 border-2 border-amber-500 rounded-2xl shadow-[0_0_0_3px_rgba(0,0,0,0.7)] px-6 py-7"
                aria-labelledby="subscribe-title"
                aria-describedby={errorId}
            >
                <h1
                    id="subscribe-title"
                    className="text-2xl font-extrabold mb-4 text-center text-amber-200 tracking-wide"
                >
                    Inscription
                </h1>

                {error && (
                    <div
                        ref={errorRef}
                        id="subscribe-error"
                        role="alert"
                        tabIndex={-1}
                        aria-live="assertive"
                        className="mb-4 text-amber-100 bg-red-900/70 border border-red-400 p-3 rounded-lg shadow-inner"
                    >
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="firstName" className="block font-semibold mb-2 text-amber-100">
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
                        aria-invalid={fieldError}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block font-semibold mb-2 text-amber-100">
                        Nom de famille
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        aria-invalid={fieldError}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="login" className="block font-semibold mb-2 text-amber-100">
                        Adresse email
                    </label>
                    <input
                        type="email"
                        id="login"
                        name="login"
                        value={form.login}
                        onChange={handleChange}
                        required
                        aria-invalid={fieldError}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="birthDate" className="block font-semibold mb-2 text-amber-100">
                        Date de naissance
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={form.birthDate}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        aria-invalid={fieldError}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block font-semibold mb-2 text-amber-100">
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
                        aria-invalid={fieldError}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 mt-2 rounded-full font-bold text-lg text-emerald-950 shadow-[0_4px_0_rgba(0,0,0,0.6)]
          bg-gradient-to-r from-amber-300 to-amber-400 border-2 border-amber-700
          hover:from-amber-200 hover:to-amber-300
          focus:outline-none focus:ring-4 focus:ring-amber-300/70
          active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.6)]
          ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    aria-busy={loading}
                >
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>
        </main>
    );
}
