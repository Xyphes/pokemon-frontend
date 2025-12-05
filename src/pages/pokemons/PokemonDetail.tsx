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

interface TrainerInfo {
    id: number;
    login: string;
}

export default function PokemonDetailPage() {
    const {token, trainerId} = useAuth();
    const {pokemonId} = useParams<{ pokemonId: string }>();
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
    const [trainer, setTrainer] = useState<TrainerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwner =
        pokemon && trainerId ? Number(trainerId) === pokemon.trainerId : false;

    // Édition
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editLevel, setEditLevel] = useState<number | "">("");
    const [editGender, setEditGender] =
        useState<"MALE" | "FEMALE" | "NOT_DEFINED">("NOT_DEFINED");
    const [editIsShiny, setEditIsShiny] = useState(false);
    const [editSize, setEditSize] = useState<number | "">("");
    const [editWeight, setEditWeight] = useState<number | "">("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPokemonAndTrainer = async () => {
            if (!token || !pokemonId) {
                setError("Vous devez être connecté pour voir ce Pokémon.");
                setLoading(false);
                return;
            }

            try {
                // 1. Charger le Pokémon
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

                // init états d'édition
                setEditName(data.name);
                setEditLevel(data.level);
                setEditGender(data.genderTypeCode);
                setEditIsShiny(data.isShiny);
                setEditSize(data.size ?? "");
                setEditWeight(data.weight ?? "");

                // 2. Charger le dresseur pour avoir le login
                const trainerRes = await fetch(
                    `http://localhost:8000/trainers/${data.trainerId}`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                if (trainerRes.ok) {
                    const t: TrainerInfo = await trainerRes.json();
                    setTrainer(t);
                }
            } catch {
                setError("Impossible de charger ce Pokémon.");
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonAndTrainer();
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

    const handleSave = async () => {
        if (!token || !pokemon) return;

        if (editLevel === "" || editLevel < 1 || editLevel > 100) {
            setError("Le niveau doit être entre 1 et 100.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8000/pokemons/${pokemon.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name:
                            editName.trim() === "" ? pokemon.species : editName.trim(),
                        level: Number(editLevel),
                        genderTypeCode: editGender,
                        isShiny: editIsShiny,
                        size: editSize === "" ? null : Number(editSize),
                        weight: editWeight === "" ? null : Number(editWeight),
                    }),
                }
            );
            if (!res.ok) throw new Error();
            const updated: PokemonDetail = await res.json();
            setPokemon(updated);
            setIsEditing(false);
        } catch {
            setError("Impossible de mettre à jour ce Pokémon pour le moment.");
        } finally {
            setSaving(false);
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

                    {/* Espèce (non éditable) */}
                    <p>
                        <span className="font-semibold text-amber-200">Espèce :</span>{" "}
                        {pokemon.species}
                    </p>

                    {/* Nom */}
                    <p>
                        <span className="font-semibold text-amber-200">Nom :</span>{" "}
                        {isEditing ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="ml-2 px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-amber-100"
                            />
                        ) : (
                            pokemon.name
                        )}
                    </p>

                    {/* Niveau */}
                    <p>
                        <span className="font-semibold text-amber-200">Niveau :</span>{" "}
                        {isEditing ? (
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={editLevel}
                                onChange={(e) =>
                                    setEditLevel(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="ml-2 px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-amber-100 w-20"
                            />
                        ) : (
                            pokemon.level
                        )}
                    </p>

                    {/* Genre */}
                    <p>
                        <span className="font-semibold text-amber-200">Genre :</span>{" "}
                        {isEditing ? (
                            <select
                                value={editGender}
                                onChange={(e) =>
                                    setEditGender(
                                        e.target.value as "MALE" | "FEMALE" | "NOT_DEFINED"
                                    )
                                }
                                className="ml-2 px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-amber-100"
                            >
                                <option value="NOT_DEFINED">
                                    ⚪ Neutre / non défini
                                </option>
                                <option value="MALE">♂ Mâle</option>
                                <option value="FEMALE">♀ Femelle</option>
                            </select>
                        ) : pokemon.genderTypeCode === "MALE" ? (
                            "♂ Mâle"
                        ) : pokemon.genderTypeCode === "FEMALE" ? (
                            "♀ Femelle"
                        ) : (
                            "⚪ Neutre / non défini"
                        )}
                    </p>

                    {/* Taille */}
                    <p>
                        <span className="font-semibold text-amber-200">Taille :</span>{" "}
                        {isEditing ? (
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={editSize}
                                onChange={(e) =>
                                    setEditSize(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="ml-2 px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-amber-100 w-24"
                            />
                        ) : pokemon.size != null ? (
                            `${pokemon.size}`
                        ) : (
                            "Non renseignée"
                        )}
                    </p>

                    {/* Poids */}
                    <p>
                        <span className="font-semibold text-amber-200">Poids :</span>{" "}
                        {isEditing ? (
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={editWeight}
                                onChange={(e) =>
                                    setEditWeight(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="ml-2 px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-amber-100 w-24"
                            />
                        ) : pokemon.weight != null ? (
                            `${pokemon.weight}`
                        ) : (
                            "Non renseigné"
                        )}
                    </p>

                    {/* Chromatique */}
                    <p>
            <span className="font-semibold text-amber-200">
              Chromatique :
            </span>{" "}
                        {isEditing ? (
                            <label className="inline-flex items-center ml-2 gap-2">
                                <input
                                    type="checkbox"
                                    checked={editIsShiny}
                                    onChange={(e) => setEditIsShiny(e.target.checked)}
                                    className="w-4 h-4 border-2 border-emerald-700 rounded bg-emerald-950 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
                                />
                                <span>{editIsShiny ? "Oui ✨" : "Non"}</span>
                            </label>
                        ) : pokemon.isShiny ? (
                            "Oui ✨"
                        ) : (
                            "Non"
                        )}
                    </p>
                </section>

                {/* Dresseur·euse */}
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
                        onClick={() => navigate(`/profile/${pokemon.trainerId}`)}
                        className="text-amber-300 underline underline-offset-2 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                    >
                        {trainer
                            ? `${trainer.login} (#${trainer.id})`
                            : `Dresseur·euse #${pokemon.trainerId}`}
                    </button>
                </section>

                {/* Actions si propriétaire */}
                {isOwner && (
                    <div className="flex flex-wrap gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
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
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditName(pokemon.name);
                                        setEditLevel(pokemon.level);
                                        setEditGender(pokemon.genderTypeCode);
                                        setEditIsShiny(pokemon.isShiny);
                                        setEditSize(pokemon.size ?? "");
                                        setEditWeight(pokemon.weight ?? "");
                                    }}
                                    className="bg-emerald-950/60 text-amber-100 px-3 py-2 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-amber-300 text-emerald-950 px-3 py-2 rounded-full font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                                >
                                    {saving ? "Enregistrement..." : "Enregistrer"}
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
