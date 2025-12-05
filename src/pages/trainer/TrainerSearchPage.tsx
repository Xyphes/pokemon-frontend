import {type FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

interface TrainerSearchResult {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
}

type SearchResponse = TrainerSearchResult[];

export default function TrainerSearchPage() {
    const {token, trainerId} = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [login, setLogin] = useState("");

    const [trainers, setTrainers] = useState<TrainerSearchResult[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 20;

    const fetchTrainers = async (pageToLoad = 0) => {
        if (!token) {
            setError("Vous devez être connecté pour rechercher des dresseur·euse·s.");
            return;
        }

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(pageToLoad));
        params.set("pageSize", String(pageSize));
        if (firstName.trim()) params.set("firstName", firstName.trim());
        if (lastName.trim()) params.set("lastName", lastName.trim());
        if (login.trim()) params.set("login", login.trim());

        try {
            const res = await fetch(
                `http://localhost:8000/trainers?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) {
                setError("Impossible de charger les dresseur·euse·s.");
                return;
            }

            const data: SearchResponse = await res.json();
            setTrainers(data);
            setPage(pageToLoad);
            setTotalPages(
                data.length === pageSize ? pageToLoad + 2 : pageToLoad + 1
            );
        } catch {
            setError("Impossible de joindre le serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTrainers(0);
        }
    }, [token]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchTrainers(0);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) fetchTrainers(page + 1);
    };

    const handlePrev = () => {
        if (page > 0) fetchTrainers(page - 1);
    };

    const errorId = error ? "trainer-search-error" : undefined;

    if (!token) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">
                    Rechercher des dresseur·euse·s
                </h1>
                <p role="alert">Vous devez être connecté pour accéder à cette page.</p>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold text-amber-200 mb-2">
                    Rechercher des dresseur·euse·s
                </h1>

                {/* Filtres */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-4"
                    aria-labelledby="trainer-search-filters-title"
                    aria-describedby={errorId}
                >
                    <h2
                        id="trainer-search-filters-title"
                        className="text-xl font-bold text-amber-200 mb-2"
                    >
                        Filtres
                    </h2>

                    {error && (
                        <div
                            id="trainer-search-error"
                            role="alert"
                            aria-live="assertive"
                            className="mb-2 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
                        >
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label htmlFor="firstName" className="block font-semibold mb-1">
                                Prénom
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block font-semibold mb-1">
                                Nom de famille
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="login" className="block font-semibold mb-1">
                                Login
                            </label>
                            <input
                                id="login"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-full bg-amber-300 text-emerald-950 font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                        >
                            {loading ? "Recherche..." : "Appliquer les filtres"}
                        </button>
                    </div>
                </form>

                {/* Résultats */}
                <section
                    aria-label="Résultats de la recherche de dresseur·euse·s"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4"
                >
                    {loading && (
                        <p aria-live="polite">Chargement des résultats…</p>
                    )}

                    {!loading && trainers.length === 0 && (
                        <p>Aucun·e dresseur·euse ne correspond à ces filtres.</p>
                    )}

                    {!loading && trainers.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-emerald-700 text-amber-200">
                                        <th className="text-left py-2 pr-2">Prénom</th>
                                        <th className="text-left py-2 pr-2">Nom</th>
                                        <th className="text-left py-2 pr-2">Login</th>
                                        <th className="text-left py-2 pr-2">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {trainers.map((t) => {
                                        const isMe =
                                            trainerId && Number(trainerId) === t.id;

                                        return (
                                            <tr
                                                key={t.id}
                                                className="border-b border-emerald-800 hover:bg-emerald-900/60"
                                            >
                                                <td className="py-2 pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/profile/${t.id}`)}
                                                        className="text-amber-200 underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                                                    >
                                                        {t.firstName}
                                                    </button>
                                                </td>
                                                <td className="py-2 pr-2">{t.lastName}</td>
                                                <td className="py-2 pr-2">{t.login}</td>
                                                <td className="py-2 pr-2">
                                                    {!isMe && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(`/trades/new?receiverId=${t.id}`)
                                                            }
                                                            className="px-3 py-1 rounded-full bg-amber-300 text-emerald-950 font-semibold border border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                                        >
                                                            Échanger
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    disabled={page === 0}
                                    className="px-3 py-1 rounded-full border border-emerald-700 text-amber-100 hover:bg-emerald-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                >
                                    Précédent·e·s
                                </button>
                                <span aria-live="polite">
        Page {page + 1} sur {totalPages || 1}
        </span>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={page + 1 >= totalPages}
                                    className="px-3 py-1 rounded-full border border-emerald-700 text-amber-100 hover:bg-emerald-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                >
                                    Suivant·e·s
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
