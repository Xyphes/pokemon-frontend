import { type FormEvent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

export default function CreateBoxPage() {
    const { token, trainerId } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (error) errorRef.current?.focus();
    }, [error]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token || !trainerId) {
            setError("Vous devez être connecté pour créer une boîte.");
            return;
        }

        if (!name.trim()) {
            setError("Le nom de la boîte est obligatoire.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}/boxes`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: name.trim() }),
                }
            );

            if (res.status === 201 || res.ok) {
                navigate("/boxes");
            } else if (res.status === 400) {
                setError("Le nom de la boîte est invalide.");
            } else {
                setError("Une erreur est survenue. Réessayez plus tard.");
            }
        } catch {
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
        }
    };

    const errorId = error ? "create-box-error" : undefined;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-emerald-950/95 border-2 border-amber-500 rounded-2xl shadow-[0_0_0_3px_rgba(0,0,0,0.7)] px-6 py-7"
                aria-labelledby="create-box-title"
                aria-describedby={errorId}
            >
                <h1
                    id="create-box-title"
                    className="text-3xl font-extrabold mb-6 text-center text-amber-200 tracking-wide"
                >
                    Nouvelle boîte d&apos;Hyrule
                </h1>

                {error && (
                    <div
                        ref={errorRef}
                        id="create-box-error"
                        role="alert"
                        aria-live="assertive"
                        tabIndex={-1}
                        className="mb-4 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
                    >
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label
                        htmlFor="box-name"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Nom de la boîte
                    </label>
                    <input
                        id="box-name"
                        name="name"
                        type="text"
                        ref={nameInputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                        placeholder="Ex. Coffre de la Forêt Kokiri"
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
                    {loading ? "Création..." : "Créer la boîte"}
                </button>
            </form>
        </main>
    );
}
