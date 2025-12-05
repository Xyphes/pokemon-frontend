import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

type StatusCode = "PROPOSITION" | "ACCEPTE" | "REFUSE";

interface RawTradeSide {
    id: number;
    pokemons: number[];
}

interface RawTradeDetail {
    id: number;
    statusCode: StatusCode;
    sender: RawTradeSide;
    receiver: RawTradeSide;
}

interface TrainerInfo {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
}

interface TradePokemon {
    id: number;
    species: string;
    name: string;
    level: number;
    genderTypeCode: "MALE" | "FEMALE" | "NOT_DEFINED";
    isShiny: boolean;
}

interface FullTradeDetail {
    id: number;
    statusCode: StatusCode;
    sender: TrainerInfo;
    receiver: TrainerInfo;
    senderPokemons: TradePokemon[];
    receiverPokemons: TradePokemon[];
}

export default function TradeDetailPage() {
    const {token, trainerId} = useAuth();
    const {tradeId} = useParams<{ tradeId: string }>();
    const navigate = useNavigate();

    const [trade, setTrade] = useState<FullTradeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTrade = async () => {
        if (!token || !tradeId) {
            setError("Vous devez être connecté pour voir cet échange.");
            setLoading(false);
            return;
        }

        try {
            // 1. Trade "brut" (ids uniquement)
            const res = await fetch(`http://localhost:8000/trades/${tradeId}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if (!res.ok) throw new Error();
            const raw: RawTradeDetail = await res.json();

            // 2. Infos des dresseur·euse·s
            const [senderRes, receiverRes] = await Promise.all([
                fetch(`http://localhost:8000/trainers/${raw.sender.id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
                fetch(`http://localhost:8000/trainers/${raw.receiver.id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                }),
            ]);
            if (!senderRes.ok || !receiverRes.ok) throw new Error();
            const sender: TrainerInfo = await senderRes.json();
            const receiver: TrainerInfo = await receiverRes.json();

            // 3. Détails des Pokémons
            const senderPokemonPromises = raw.sender.pokemons.map((id) =>
                fetch(`http://localhost:8000/pokemons/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                }).then((r) => {
                    if (!r.ok) throw new Error();
                    return r.json() as Promise<TradePokemon>;
                })
            );
            const receiverPokemonPromises = raw.receiver.pokemons.map((id) =>
                fetch(`http://localhost:8000/pokemons/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                }).then((r) => {
                    if (!r.ok) throw new Error();
                    return r.json() as Promise<TradePokemon>;
                })
            );

            const [senderPokemons, receiverPokemons] = await Promise.all([
                Promise.all(senderPokemonPromises),
                Promise.all(receiverPokemonPromises),
            ]);

            setTrade({
                id: raw.id,
                statusCode: raw.statusCode,
                sender,
                receiver,
                senderPokemons,
                receiverPokemons,
            });
        } catch {
            setError("Impossible de charger cet échange.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrade();
    }, [token, tradeId]);

    const isReceiver =
        trade && trainerId ? Number(trainerId) === trade.receiver.id : false;
    const isPending = trade?.statusCode === "PROPOSITION";
    const canRespond = isReceiver && isPending;

    const handleAction = async (action: "accept" | "refuse") => {
        if (!token || !trade) return;
        setActionLoading(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8000/trades/${trade.id}/${action}`,
                {
                    method: "PATCH",
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            if (!res.ok) throw new Error();
            await loadTrade();
        } catch {
            setError(
                action === "accept"
                    ? "Impossible d'accepter cet échange."
                    : "Impossible de refuser cet échange."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-emerald-950 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4">Détail de l’échange</h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error || !trade) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">Détail de l’échange</h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error ?? "Échange introuvable."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/trades")}
                    className="bg-emerald-900 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    Retour
                </button>
            </main>
        );
    }

    const statusLabel =
        trade.statusCode === "PROPOSITION"
            ? "En attente"
            : trade.statusCode === "ACCEPTE"
                ? "Accepté"
                : "Refusé";

    const renderPokemonCard = (p: TradePokemon) => (
        <button
            key={p.id}
            type="button"
            onClick={() => navigate(`/pokemon/${p.id}`)}
            className="text-left px-3 py-2 rounded-lg border text-sm bg-emerald-900/80 text-amber-100 border-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
            <div className="font-semibold">
                {p.name} ({p.species})
            </div>
            <div>Nv {p.level}</div>
            <div>
                Genre :{" "}
                {p.genderTypeCode === "MALE"
                    ? "♂ Mâle"
                    : p.genderTypeCode === "FEMALE"
                        ? "♀ Femelle"
                        : "⚪ Neutre"}
            </div>
            <div>Chromatique : {p.isShiny ? "Oui ✨" : "Non"}</div>
        </button>
    );

    return (
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-extrabold text-amber-200">
                        Échange #{trade.id}
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate("/trades")}
                        className="bg-emerald-900 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                        Retour
                    </button>
                </div>

                {/* Statut */}
                <section className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4">
                    <h2 className="text-xl font-bold text-amber-200 mb-2">Statut</h2>
                    <p>
                        Statut de l’échange :{" "}
                        <span className="font-semibold text-amber-200">
              {statusLabel}
            </span>
                    </p>
                </section>

                {/* Envoyeur */}
                <section className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-3">
                    <h2 className="text-xl font-bold text-amber-200 mb-2">
                        Envoyeur·euse
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate(`/profile/${trade.sender.id}`)}
                        className="text-amber-200 underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                    >
                        {trade.sender.firstName} {trade.sender.lastName} —{" "}
                        {trade.sender.login}
                    </button>

                    <div className="mt-2">
                        <h3 className="font-semibold text-amber-200 mb-1">
                            Pokémons offerts
                        </h3>
                        {trade.senderPokemons.length === 0 ? (
                            <p className="text-amber-300 text-sm">
                                Aucun Pokémon offert dans cet échange.
                            </p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {trade.senderPokemons.map(renderPokemonCard)}
                            </div>
                        )}
                    </div>
                </section>

                {/* Receveur */}
                <section className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-3">
                    <h2 className="text-xl font-bold text-amber-200 mb-2">
                        Receveur·euse
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate(`/profile/${trade.receiver.id}`)}
                        className="text-amber-200 underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                    >
                        {trade.receiver.firstName} {trade.receiver.lastName} —{" "}
                        {trade.receiver.login}
                    </button>

                    <div className="mt-2">
                        <h3 className="font-semibold text-amber-200 mb-1">
                            Pokémons reçus
                        </h3>
                        {trade.receiverPokemons.length === 0 ? (
                            <p className="text-amber-300 text-sm">
                                Aucun Pokémon demandé dans cet échange.
                            </p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {trade.receiverPokemons.map(renderPokemonCard)}
                            </div>
                        )}
                    </div>
                </section>

                {/* Actions si receveur et PROPOSITION */}
                {canRespond && (
                    <section className="flex flex-wrap gap-3 justify-end">
                        <button
                            type="button"
                            onClick={() => handleAction("accept")}
                            disabled={actionLoading}
                            className="px-4 py-2 rounded-full bg-emerald-600 text-emerald-50 font-semibold border border-emerald-300 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60"
                        >
                            Accepter l’échange
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAction("refuse")}
                            disabled={actionLoading}
                            className="px-4 py-2 rounded-full bg-red-800 text-red-50 font-semibold border border-red-400 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-60"
                        >
                            Refuser l’échange
                        </button>
                    </section>
                )}
            </div>
        </main>
    );
}
