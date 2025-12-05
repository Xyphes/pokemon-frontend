import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type TradeStatusCode = "PROPOSITION" | "ACCEPTED" | "DECLINED";

interface TradeListItem {
    id: number;
    statusCode: TradeStatusCode;
    sender: { id: number };
    receiver: { id: number };
}

type TradesResponse = TradeListItem[];

export default function TradesListPage() {
    const { token, trainerId } = useAuth();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState<"any" | TradeStatusCode>("any");
    const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");

    const [trades, setTrades] = useState<TradeListItem[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 20;

    const fetchTrades = async (pageToLoad = 0) => {
        if (!token || !trainerId) {
            setError("Vous devez être connecté pour voir vos échanges.");
            return;
        }

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(pageToLoad));
        params.set("pageSize", String(pageSize));
        params.set("orderBy", sortOrder); // ASC / DESC
        if (statusFilter !== "any") params.set("statusCode", statusFilter);

        try {
            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}/trades?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!res.ok) {
                setError(`Impossible de charger les échanges (code ${res.status}).`);
                return;
            }
            const data: TradesResponse = await res.json();
            setTrades(data);
            setPage(pageToLoad);
            setTotalPages(
                data.length === pageSize ? pageToLoad + 2 : pageToLoad + 1
            );
        } catch {
            setError("Erreur de communication avec le serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && trainerId) {
            fetchTrades(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, trainerId, sortOrder, statusFilter]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchTrades(0);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) fetchTrades(page + 1);
    };

    const handlePrev = () => {
        if (page > 0) fetchTrades(page - 1);
    };

    const handleAccept = async (tradeId: number) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:8000/trades/${tradeId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statusCode: "ACCEPTED" }),
            });
            if (!res.ok) throw new Error();
            fetchTrades(page);
        } catch {
            setError("Impossible d'accepter cet échange.");
        }
    };

    const handleRefuse = async (tradeId: number) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:8000/trades/${tradeId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statusCode: "DECLINED" }),
            });
            if (!res.ok) throw new Error();
            fetchTrades(page);
        } catch {
            setError("Impossible de refuser cet échange.");
        }
    };


    const errorId = error ? "trades-error" : undefined;

    if (!token) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">Mes échanges</h1>
                <p role="alert">Vous devez être connecté pour voir vos échanges.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold text-amber-200 mb-2">
                    Mes échanges
                </h1>

                {/* Filtres */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-4"
                    aria-labelledby="trades-filters-title"
                    aria-describedby={errorId}
                >
                    <h2
                        id="trades-filters-title"
                        className="text-xl font-bold text-amber-200 mb-2"
                    >
                        Filtres
                    </h2>

                    {error && (
                        <div
                            id="trades-error"
                            role="alert"
                            aria-live="assertive"
                            className="mb-2 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Filtre statut */}
                        <div>
                            <label className="block font-semibold mb-1" htmlFor="status">
                                Statut de l’échange
                            </label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as "any" | TradeStatusCode
                                    )
                                }
                                className="border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            >
                                <option value="any">Tous</option>
                                <option value="PROPOSITION">En attente</option>
                                <option value="ACCEPTED">Acceptés</option>
                                <option value="DECLINED">Refusés</option>
                            </select>
                        </div>

                        {/* Tri */}
                        <div className="flex items-center gap-2 mt-4 md:mt-7">
                            {sortOrder === "DESC" ? (
                                <button
                                    type="button"
                                    onClick={() => setSortOrder("ASC")}
                                    className="px-3 py-1 rounded-full bg-emerald-900 text-amber-100 border border-amber-400 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
                                >
                                    Du plus ancien au plus récent
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setSortOrder("DESC")}
                                    className="px-3 py-1 rounded-full bg-emerald-900 text-amber-100 border border-amber-400 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300 text-sm"
                                >
                                    Du plus récent au plus ancien
                                </button>
                            )}
                        </div>

                        <div className="ml-auto">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 rounded-full bg-amber-300 text-emerald-950 font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                            >
                                {loading ? "Filtrage…" : "Appliquer les filtres"}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Résultats */}
                <section
                    aria-label="Liste des échanges"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4"
                >
                    {loading && (
                        <p aria-live="polite">Chargement des échanges…</p>
                    )}

                    {!loading && trades.length === 0 && (
                        <p>Aucun échange ne correspond à ces filtres.</p>
                    )}

                    {!loading && trades.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-emerald-700 text-amber-200">
                                        <th className="text-left py-2 pr-2">ID</th>
                                        <th className="text-left py-2 pr-2">Envoyeur·euse</th>
                                        <th className="text-left py-2 pr-2">Receveur·euse</th>
                                        <th className="text-left py-2 pr-2">Statut</th>
                                        <th className="text-left py-2 pr-2">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {trades.map((t) => {
                                        const isReceiver =
                                            trainerId && Number(trainerId) === t.receiver.id;
                                        const isPending = t.statusCode === "PROPOSITION";

                                        return (
                                            <tr
                                                key={t.id}
                                                className="border-b border-emerald-800 hover:bg-emerald-900/60"
                                            >
                                                <td className="py-2 pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/trades/${t.id}`)}
                                                        className="text-amber-200 underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                                                    >
                                                        #{t.id}
                                                    </button>
                                                </td>
                                                <td className="py-2 pr-2">#{t.sender.id}</td>
                                                <td className="py-2 pr-2">#{t.receiver.id}</td>
                                                <td className="py-2 pr-2">
                                                    {t.statusCode === "PROPOSITION"
                                                        ? "En attente"
                                                        : t.statusCode === "ACCEPTED"
                                                            ? "Accepté"
                                                            : "Refusé"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    {isReceiver && isPending && (
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAccept(t.id)}
                                                                className="px-3 py-1 rounded-full bg-emerald-600 text-emerald-50 font-semibold border border-emerald-300 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                                            >
                                                                Accepter
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRefuse(t.id)}
                                                                className="px-3 py-1 rounded-full bg-red-800 text-red-50 font-semibold border border-red-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                            >
                                                                Refuser
                                                            </button>
                                                        </div>
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
