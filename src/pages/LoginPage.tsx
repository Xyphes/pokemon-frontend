import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LoginForm {
    login: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<LoginForm>({ login: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [fieldError, setFieldError] = useState(false);
    const [loading, setLoading] = useState(false);

    const errorRef = useRef<HTMLDivElement>(null);
    const loginRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loginRef.current?.focus();
    }, []);

    useEffect(() => {
        if (error) {
            errorRef.current?.focus();
        }
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldError(false);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.status === 200) {
                const data = await res.json();
                login(data.accessToken);
                navigate("/");
            } else if (res.status === 400 || res.status === 401) {
                setError("Identifiants invalides. Vérifiez votre email et votre mot de passe.");
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

    return (
        <main className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded shadow"
                aria-labelledby="login-title"
                aria-describedby={error ? "login-error" : undefined}
            >
                <h1 id="login-title" className="text-2xl font-bold mb-4">
                    Connexion
                </h1>

                {error && (
                    <div
                        ref={errorRef}
                        id="login-error"
                        className="mb-4 text-red-700 bg-red-100 p-2 rounded"
                        role="alert"
                        tabIndex={-1}
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
                        ref={loginRef}
                        value={form.login}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-invalid={fieldError}
                        aria-describedby={error ? "login-error" : undefined}
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
                        aria-invalid={fieldError}
                        aria-describedby={error ? "login-error" : undefined}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-busy={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </main>
    );
}
