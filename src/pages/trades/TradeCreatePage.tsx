import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

interface Trainer {
    id: number;
    firstName: string;
    lastName: string;
    login: string;
}

interface Pokemon {
    id: number;
    species: string;
    name: string;
    level: number;
    isShiny: boolean;
}

export default function TradeCreatePage() {
    const {token, trainerId: currentTrainerId} = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const receiverIdParam = searchParams.get("receiverId");

    const [me, setMe] = useState<Trainer | null>(null);
    const [receiver, setReceiver] = useState<Trainer | null>(null);
    const [myPokemons, setMyPokemons] = useState<Pokemon[]>([]);
    const [receiverPokemons, setReceiverPokemons] = useState<Pokemon[]>([]);

    const [mySelected, setMySelected] = useState<number[]>([]);
    const [receiverSelected, setReceiverSelected] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!token || !currentTrainerId || !receiverIdParam) {
                setError("Dresseur·euse receveur·euse manquant·e ou non connecté·e.");
                setLoading(false);
                return;
            }

            const receiverId = Number(receiverIdParam);
            if (Number.isNaN(receiverId)) {
                setError("Identifiant du receveur invalide.");
                setLoading(false);
                return;
            }

            try {
                const [meRes, receiverRes] = await Promise.all([
                    fetch(`http://localhost:8000/trainers/${currentTrainerId}`, {
                        headers: {Authorization: `Bearer ${token}`},
                    }),
                    fetch(`http://localhost:8000/trainers/${receiverId}`, {
                        headers: {Authorization: `Bearer ${token}`},
                    }),
                ]);

                if (!meRes.ok || !receiverRes.ok) throw new Error();

                const meData: Trainer = await meRes.json();
                const receiverData: Trainer = await receiverRes.json();

                setMe(meData);
                setReceiver(receiverData);

                const [myPkmRes, recPkmRes] = await Promise.all([
                    fetch(
                        `http://localhost:8000/trainers/${currentTrainerId}/pokemons`,
                        {headers: {Authorization: `Bearer ${token}`}}
                    ),
                    fetch(`http://localhost:8000/trainers/${receiverId}/pokemons`, {
                        headers: {Authorization: `Bearer ${token}`},
                    }),
                ]);

                if (!myPkmRes.ok || !recPkmRes.ok) throw new Error();

                const myPkmData: Pokemon[] = await myPkmRes.json();
                const recPkmData: Pokemon[] = await recPkmRes.json();

                setMyPokemons(myPkmData);
                setReceiverPokemons(recPkmData);
            } catch {
                setError("Impossible de charger les informations pour l'échange.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [token, currentTrainerId, receiverIdParam]);

    const toggleMyPokemon = (id: number) => {
        setMySelected((current) =>
            current.includes(id)
                ? current.filter((x) => x !== id)
                : current.length < 6
                    ? [...current, id]
                    : current
        );
    };

    const toggleReceiverPokemon = (id: number) => {
        setReceiverSelected((current) =>
            current.includes(id)
                ? current.filter((x) => x !== id)
                : current.length < 6
                    ? [...current, id]
                    : current
        );
    };

    const handleSubmit = async () => {
        if (!token || !receiverIdParam) return;
        const receiverId = Number(receiverIdParam);
        if (Number.isNaN(receiverId)) return;
        if (mySelected.length === 0 || receiverSelected.length === 0) return;

        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8000/trades", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pokemonsOfferedIds: mySelected,
                    pokemonsWantedIds: receiverSelected,
                    receiverId,
                }),
            });

            if (!res.ok) {
                setError("Impossible de créer l'échange.");
                return;
            }

            const data: { id: number } = await res.json();
            navigate(`/trades/${data.id}`);
        } catch {
            setError("Erreur lors de l'envoi de la proposition.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-emerald-950 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4">Nouvel échange</h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error || !me || !receiver) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">Nouvel échange</h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error ?? "Impossible d'initialiser l'échange."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-emerald-900 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    Retour
                </button>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold text-amber-200 mb-2">
                    Créer un échange
                </h1>

                {/* Moi */}
                <section
                    aria-labelledby="me-section-title"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4"
                >
                    <h2
                        id="me-section-title"
                        className="text-xl font-bold text-amber-200 mb-2"
                    >
                        Mes Pokémons
                    </h2>
                    <p className="mb-2">
                        {me.firstName} {me.lastName} — {me.login}
                    </p>
                    <p className="mb-2 text-sm text-amber-300">
                        Sélectionnez jusqu'à 6 Pokémons à proposer.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {myPokemons.map((p) => {
                            const selected = mySelected.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => toggleMyPokemon(p.id)}
                                    className={`text-left px-3 py-2 rounded-lg border text-sm transition 
                    ${
                                        selected
                                            ? "bg-amber-300 text-emerald-950 border-amber-400"
                                            : "bg-emerald-900/80 text-amber-100 border-emerald-700 hover:bg-emerald-800"
                                    }`}
                                    aria-pressed={selected}
                                >
                                    <div className="font-semibold">
                                        {p.name} ({p.species})
                                    </div>
                                    <div>Nv {p.level}</div>
                                    {p.isShiny && <div>✨ Shiny</div>}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Receveur */}
                <section
                    aria-labelledby="receiver-section-title"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4"
                >
                    <h2
                        id="receiver-section-title"
                        className="text-xl font-bold text-amber-200 mb-2"
                    >
                        Pokémons de {receiver.login}
                    </h2>
                    <p className="mb-2">
                        {receiver.firstName} {receiver.lastName} — {receiver.login}
                    </p>
                    <p className="mb-2 text-sm text-amber-300">
                        Sélectionnez jusqu'à 6 Pokémons que vous souhaitez recevoir.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {receiverPokemons.map((p) => {
                            const selected = receiverSelected.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => toggleReceiverPokemon(p.id)}
                                    className={`text-left px-3 py-2 rounded-lg border text-sm transition 
                    ${
                                        selected
                                            ? "bg-amber-300 text-emerald-950 border-amber-400"
                                            : "bg-emerald-900/80 text-amber-100 border-emerald-700 hover:bg-emerald-800"
                                    }`}
                                    aria-pressed={selected}
                                >
                                    <div className="font-semibold">
                                        {p.name} ({p.species})
                                    </div>
                                    <div>Nv {p.level}</div>
                                    {p.isShiny && <div>✨ Shiny</div>}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Bouton envoyer */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            submitting ||
                            mySelected.length === 0 ||
                            receiverSelected.length === 0
                        }
                        className="px-5 py-2 rounded-full bg-amber-300 text-emerald-950 font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                    >
                        {submitting
                            ? "Envoi de la proposition…"
                            : "Envoyer la proposition d’échange"}
                    </button>
                </div>
            </div>
        </main>
    );
}
