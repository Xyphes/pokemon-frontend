import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

interface PokemonDetail {
    id: number;
    trainerId: number;
    boxId: number;
    species: string;
    name: string;
    level: number;
    genderTypeCode: "MALE" | "FEMALE" | "NOT_DEFINED";
    isShiny: boolean;
    size: number | null;
    weight: number | null;
}

export default function PokemonDetailPage() {
    const {token, trainerId} = useAuth();
    const {pokemonId} = useParams<{ pokemonId: string }>();
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwner =
        pokemon && trainerId ? Number(trainerId) === pokemon.trainerId : false;

    useEffect(() => {
        const fetchPokemon = async () => {
            if (!token || !pokemonId) {
                setError("Vous devez être connecté pour voir ce Pokémon.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:8000/pokemons/${pokemonId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!res.ok) throw new Error();
                const data: PokemonDetail = await res.json();
                setPokemon(data);
            } catch {
                setError("Impossible de charger ce Pokémon.");
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [token, pokemonId]);

    const handleDelete = async () => {
        if (!token || !pokemon) return;
        const ok = window.confirm(
            `Supprimer définitivement ${pokemon.name} ?`
        );
        if (!ok) return;

        try {
            const res = await fetch(
                `http://localhost:8000/pokemons/${pokemon.id}`,
                {
                    method: "DELETE",
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            if (!res.ok) throw new Error();
            navigate(`/boxes/${pokemon.boxId}`);
        } catch {
            setError("Impossible de supprimer ce Pokémon pour le moment.");
        }
    };

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Pokémon
                </h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error || !pokemon) {
        return (
            <main
                className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Pokémon
                </h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error ?? "Pokémon introuvable."}
                </p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-emerald-950/60 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    Retour
                </button>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Titre + Retour */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-extrabold text-amber-200">
                        {pokemon.name} ({pokemon.species})
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-emerald-950/60 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                        Retour
                    </button>
                </div>

                {/* Image */}
                <div className="flex justify-center">
                    <img
                        src={`https://img.pokemondb.net/artwork/large/${pokemon.species
                            .toLowerCase()
                            .replace(/ /g, "-")}.jpg`}
                        alt={`Illustration de ${pokemon.species}`}
                        className="w-40 h-40 object-contain rounded-2xl border-2 border-emerald-700 bg-emerald-900/70 p-3"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/fallback-pokemon.png";
                        }}
                    />
                </div>


                {/* Shiny badge */}
                {pokemon.isShiny && (
                    <div className="flex justify-center">
            <span
                className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm font-bold rounded-full border border-yellow-400/50">
              ✨ Pokémon chromatique
            </span>
                    </div>
                )}

                {/* Infos principales */}
                <section
                    aria-labelledby="pokemon-info-title"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-2"
                >
                    <h2
                        id="pokemon-info-title"
                        className="text-xl font-bold text-amber-200 mb-1"
                    >
                        Informations
                    </h2>
                    <p>
                        <span className="font-semibold text-amber-200">Espèce :</span>{" "}
                        {pokemon.species}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Nom :</span>{" "}
                        {pokemon.name}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Niveau :</span>{" "}
                        {pokemon.level}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Genre :</span>{" "}
                        {pokemon.genderTypeCode === "MALE"
                            ? "♂ Mâle"
                            : pokemon.genderTypeCode === "FEMALE"
                                ? "♀ Femelle"
                                : "⚪ Neutre / non défini"}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Taille :</span>{" "}
                        {pokemon.size != null ? `${pokemon.size}` : "Non renseignée"}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Poids :</span>{" "}
                        {pokemon.weight != null ? `${pokemon.weight}` : "Non renseigné"}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Chromatique :</span>{" "}
                        {pokemon.isShiny ? "Oui ✨" : "Non"}
                    </p>
                </section>

                {/* Dresseur·euse (avec id uniquement pour l'instant) */}
                <section
                    aria-labelledby="trainer-info-title"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-2"
                >
                    <h2
                        id="trainer-info-title"
                        className="text-xl font-bold text-amber-200 mb-1"
                    >
                        Dresseur·euse
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate(`/trainers/${pokemon.trainerId}`)}
                        className="text-amber-300 underline underline-offset-2 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                    >
                        Dresseur·euse #{pokemon.trainerId}
                    </button>
                </section>

                {/* Actions si propriétaire */}
                {isOwner && (
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/pokemons/${pokemon.id}/edit`)}
                            className="bg-amber-300 text-emerald-950 px-3 py-2 rounded-full font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Modifier le Pokémon
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="bg-red-800/80 text-red-50 px-3 py-2 rounded-full font-semibold border border-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Supprimer le Pokémon
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
