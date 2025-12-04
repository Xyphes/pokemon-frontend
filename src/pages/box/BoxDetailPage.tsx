import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PokemonInBox {
    id: number;
    species: string;
    name: string;
    level: number;
    genderTypeCode: "MALE" | "FEMALE" | "NOT_DEFINED";
    isShiny: boolean;
}

interface BoxDetail {
    id: number;
    name: string;
    pokemons: PokemonInBox[];
}

export default function BoxDetailPage() {
    const { token, trainerId } = useAuth();
    const { boxId } = useParams<{ boxId: string }>();
    const navigate = useNavigate();

    const [box, setBox] = useState<BoxDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwner = Boolean(trainerId);

    useEffect(() => {
        const fetchBox = async () => {
            if (!token || !trainerId || !boxId) {
                setError("Vous devez être connecté pour voir cette boîte.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:8000/trainers/${trainerId}/boxes/${boxId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) throw new Error();

                const data: BoxDetail = await res.json();
                setBox(data);
            } catch {
                setError("Impossible de charger cette boîte.");
            } finally {
                setLoading(false);
            }
        };

        fetchBox();
    }, [token, trainerId, boxId]);

    const handleDelete = async () => {
        if (!token || !trainerId || !box) return;
        const ok = window.confirm(
            `Voulez-vous vraiment supprimer la boîte "${box.name}" ?`
        );
        if (!ok) return;

        try {
            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}/boxes/${box.id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!res.ok) throw new Error();
            navigate("/boxes");
        } catch {
            setError("Impossible de supprimer cette boîte pour le moment.");
        }
    };

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Coffre d&apos;Hyrule
                </h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error || !box) {
        return (
            <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Coffre d&apos;Hyrule
                </h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error ?? "Boîte introuvable."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/boxes")}
                    className="bg-emerald-950/60 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    Retour
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Titre + bouton Retour */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-extrabold text-amber-200">
                        Coffre&nbsp;: {box.name}
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate("/boxes")}
                        className="bg-emerald-950/60 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                        Retour
                    </button>
                </div>

                {/* Boutons d'action */}
                {isOwner && (
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/boxes/${box.id}/add-pokemon`)}
                            className="bg-amber-300 text-emerald-950 px-3 py-2 rounded-full font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Ajout d&apos;un Pokémon
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/boxes/${box.id}/move-pokemon`)}
                            className="bg-emerald-950/60 text-amber-100 px-3 py-2 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Déplacer un Pokémon
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/boxes/${box.id}/rename`)}
                            className="bg-emerald-950/60 text-amber-100 px-3 py-2 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Renommer la boîte
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-800/80 text-red-50 px-3 py-2 rounded-full font-semibold border border-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Suppression de la boîte
                        </button>
                    </div>
                )}

                {/* Liste des Pokémons avec images */}
                <section aria-label="Pokémons contenus dans la boîte">
                    {box.pokemons.length === 0 ? (
                        <p className="text-center py-12 text-amber-300">
                            Aucun Pokémon dans ce coffre.
                        </p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {box.pokemons.map((p) => (
                                <li key={p.id}>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/pokemon/${p.id}`)}
                                        className="w-full text-left bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 shadow-[0_4px_0_rgba(0,0,0,0.7)] hover:bg-emerald-800/80 hover:shadow-[0_6px_0_rgba(0,0,0,0.7)] focus:outline-none focus:ring-4 focus:ring-amber-300/80 transition-all"
                                        aria-label={`Voir le Pokémon ${p.name}, espèce ${p.species}, niveau ${p.level}${p.isShiny ? ", chromatique" : ""}`}
                                    >
                                        {/* Image Pokémon */}
                                        <div className="flex justify-center mb-3">
                                            <img
                                                src={`https://img.pokemondb.net/artwork/large/${p.species.toLowerCase().replace(/ /g, '-')}.jpg`}
                                                alt={`Illustration de ${p.species}`}
                                                className="w-20 h-20 object-contain rounded-lg border-2 border-emerald-600/50 bg-emerald-900/50 p-2"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x80/2d5a3a/8b4513?text=?";
                                                }}
                                            />
                                        </div>

                                        {/* Shiny indicator */}
                                        {p.isShiny && (
                                            <div className="flex justify-center mb-2">
                        <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full border border-yellow-400/50">
                          ✨ Shiny
                        </span>
                                            </div>
                                        )}

                                        {/* Nom + niveau */}
                                        <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg text-amber-200 truncate">
                        {p.name}
                      </span>
                                            <span className="text-sm bg-emerald-800/60 px-2 py-1 rounded-full text-amber-300 font-semibold">
                        Nv {p.level}
                      </span>
                                        </div>

                                        {/* Infos détaillées */}
                                        <div className="space-y-1 text-sm text-amber-100/90">
                                            <p><span className="font-medium text-amber-200">Espèce :</span> {p.species}</p>
                                            <p>
                                                <span className="font-medium text-amber-200">Genre :</span>{" "}
                                                {p.genderTypeCode === "MALE" ? "♂ Mâle" :
                                                    p.genderTypeCode === "FEMALE" ? "♀ Femelle" : "⚪ Non défini"}
                                            </p>
                                            <p>
                                                <span className="font-medium text-amber-200">Chromatique :</span>{" "}
                                                <span className={`font-semibold px-1 rounded ${p.isShiny ? 'text-yellow-300' : 'text-amber-300'}`}>
                          {p.isShiny ? "Oui ✨" : "Non"}
                        </span>
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
