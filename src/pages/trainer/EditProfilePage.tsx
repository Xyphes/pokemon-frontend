import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

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

interface SimpleBox {
    id: number;
    name: string;
}

export default function BoxDetailPage() {
    const {token, trainerId} = useAuth();
    const {boxId} = useParams<{ boxId: string }>();
    const navigate = useNavigate();

    const [box, setBox] = useState<BoxDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState("");
    const [savingName, setSavingName] = useState(false);

    const isOwner = Boolean(trainerId);

    // Déplacement
    const [isMoving, setIsMoving] = useState(false);
    const [selectedPokemons, setSelectedPokemons] = useState<number[]>([]);
    const [destinationBoxId, setDestinationBoxId] = useState<string>("");
    const [availableBoxes, setAvailableBoxes] = useState<SimpleBox[]>([]);
    const [loadingBoxes, setLoadingBoxes] = useState(false);
    const [moving, setMoving] = useState(false);

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
                setNewName(data.name);
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
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            if (!res.ok) throw new Error();
            navigate("/boxes");
        } catch {
            setError("Impossible de supprimer cette boîte pour le moment.");
        }
    };

    const handleRename = async () => {
        if (!token || !trainerId || !box) return;
        if (!newName.trim()) return;

        setSavingName(true);
        try {
            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}/boxes/${box.id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({name: newName.trim()}),
                }
            );

            if (!res.ok) throw new Error();

            setBox({...box, name: newName.trim()});
            setIsRenaming(false);
        } catch {
            setError("Impossible de renommer cette boîte pour le moment.");
        } finally {
            setSavingName(false);
        }
    };

    // Entrer en mode déplacement
    const enterMoveMode = async () => {
        if (!token || !trainerId || !boxId) return;
        setIsMoving(true);
        setSelectedPokemons([]);
        setDestinationBoxId("");
        setAvailableBoxes([]);
        setLoadingBoxes(true);

        try {
            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}/boxes`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            if (!res.ok) throw new Error();
            const data: SimpleBox[] = await res.json();
            const others = data.filter((b) => String(b.id) !== boxId);
            setAvailableBoxes(others);
        } catch {
            setError("Impossible de charger la liste des boîtes.");
        } finally {
            setLoadingBoxes(false);
        }
    };

    const toggleSelectedPokemon = (id: number) => {
        setSelectedPokemons((curr) =>
            curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]
        );
    };

    // Valider le déplacement (PATCH /pokemons/{id} avec boxId)
    const handleMoveValidate = async () => {
        if (!token || !trainerId || !box || !destinationBoxId) return;
        if (selectedPokemons.length === 0) {
            setError("Sélectionne au moins un Pokémon.");
            return;
        }

        const dest = Number(destinationBoxId);
        if (Number.isNaN(dest)) {
            setError("Boîte de destination invalide.");
            return;
        }

        setMoving(true);
        setError(null);

        try {
            await Promise.all(
                selectedPokemons.map(async (pokemonId) => {
                    const res = await fetch(
                        `http://localhost:8000/pokemons/${pokemonId}`,
                        {
                            method: "PATCH",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({boxId: dest}),
                        }
                    );
                    if (!res.ok) {
                        const txt = await res.text();
                        console.log("PATCH error", res.status, txt);
                        throw new Error("patch failed");
                    }
                })
            );

            // recharger la boîte actuelle
            setLoading(true);
            const boxRes = await fetch(
                `http://localhost:8000/trainers/${trainerId}/boxes/${box.id}`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            if (!boxRes.ok) throw new Error();
            const data: BoxDetail = await boxRes.json();
            setBox(data);

            setIsMoving(false);
            setSelectedPokemons([]);
            setDestinationBoxId("");
        } catch {
            setError("Impossible de déplacer ces Pokémons pour le moment.");
        } finally {
            setMoving(false);
            setLoading(false);
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
            <main
                className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
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
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Titre + Retour */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {isRenaming ? (
                            <>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-emerald-950/80 border border-amber-400 text-amber-100 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                                    aria-label="Nouveau nom de la boîte"
                                />
                                <button
                                    type="button"
                                    onClick={handleRename}
                                    disabled={savingName}
                                    className="bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-full font-semibold border border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                                >
                                    {savingName ? "Enregistrement..." : "Valider"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRenaming(false);
                                        setNewName(box.name);
                                    }}
                                    className="bg-emerald-950/60 text-amber-100 px-3 py-1.5 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                >
                                    Annuler
                                </button>
                            </>
                        ) : (
                            <h1 className="text-3xl font-extrabold text-amber-200">
                                Coffre&nbsp;: {box.name}
                            </h1>
                        )}
                    </div>

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
                            onClick={enterMoveMode}
                            className="bg-emerald-950/60 text-amber-100 px-3 py-2 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Déplacer un Pokémon
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRenaming(true)}
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

                {/* Liste des Pokémons */}
                <section aria-label="Pokémons contenus dans la boîte">
                    {box.pokemons.length === 0 ? (
                        <p className="text-center py-12 text-amber-300">
                            Aucun Pokémon dans ce coffre.
                        </p>
                    ) : (
                        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {box.pokemons.map((p) => {
                                const selected = isMoving && selectedPokemons.includes(p.id);
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                isMoving
                                                    ? toggleSelectedPokemon(p.id)
                                                    : navigate(`/pokemon/${p.id}`)
                                            }
                                            className={`w-full text-left bg-emerald-950/80 border rounded-xl p-4 shadow-[0_4px_0_rgba(0,0,0,0.7)] hover:bg-emerald-800/80 hover:shadow-[0_6px_0_rgba(0,0,0,0.7)] focus:outline-none focus:ring-4 focus:ring-amber-300/80 transition-all
                        ${
                                                selected
                                                    ? "border-amber-400 bg-emerald-900"
                                                    : "border-emerald-700"
                                            }`}
                                            aria-pressed={selected}
                                        >
                                            <div className="flex justify-center mb-3">
                                                <img
                                                    src={`https://img.pokemondb.net/artwork/large/${p.species
                                                        .toLowerCase()
                                                        .replace(/ /g, "-")}.jpg`}
                                                    alt={`Illustration de ${p.species}`}
                                                    className="w-20 h-20 object-contain rounded-lg border-2 border-emerald-600/50 bg-emerald-900/50 p-2"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "/fallback-pokemon.png";
                                                    }}
                                                />
                                            </div>

                                            {p.isShiny && (
                                                <div className="flex justify-center mb-2">
                          <span
                              className="px-2 py-0.5 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full border border-yellow-400/50">
                            ✨ Shiny
                          </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-amber-200 truncate">
                          {p.name}
                        </span>
                                                <span
                                                    className="text-sm bg-emerald-800/60 px-2 py-1 rounded-full text-amber-300 font-semibold">
                          Nv {p.level}
                        </span>
                                            </div>

                                            <div className="space-y-1 text-sm text-amber-100/90">
                                                <p>
                          <span className="font-medium text-amber-200">
                            Espèce :
                          </span>{" "}
                                                    {p.species}
                                                </p>
                                                <p>
                          <span className="font-medium text-amber-200">
                            Genre :
                          </span>{" "}
                                                    {p.genderTypeCode === "MALE"
                                                        ? "♂ Mâle"
                                                        : p.genderTypeCode === "FEMALE"
                                                            ? "♀ Femelle"
                                                            : "⚪ Non défini"}
                                                </p>
                                                <p>
                          <span className="font-medium text-amber-200">
                            Chromatique :
                          </span>{" "}
                                                    <span
                                                        className={`font-semibold px-1 rounded ${
                                                            p.isShiny ? "text-yellow-300" : "text-amber-300"
                                                        }`}
                                                    >
                            {p.isShiny ? "Oui ✨" : "Non"}
                          </span>
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                {/* Bloc déplacement */}
                {isMoving && (
                    <section className="mt-6 bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-3">
                        <h2 className="text-lg font-bold text-amber-200">
                            Déplacer {selectedPokemons.length} Pokémon(s)
                        </h2>

                        <div className="space-y-2">
                            <label
                                htmlFor="destination"
                                className="block font-semibold text-amber-100"
                            >
                                Choisir une boîte de destination
                            </label>

                            {loadingBoxes ? (
                                <p>Chargement des boîtes…</p>
                            ) : availableBoxes.length === 0 ? (
                                <p className="text-amber-300 text-sm">
                                    Aucune autre boîte disponible pour le déplacement.
                                </p>
                            ) : (
                                <select
                                    id="destination"
                                    value={destinationBoxId}
                                    onChange={(e) => setDestinationBoxId(e.target.value)}
                                    className="border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                >
                                    <option value="">Choisissez une boîte…</option>
                                    {availableBoxes.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name} (#{b.id})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMoving(false);
                                    setSelectedPokemons([]);
                                    setDestinationBoxId("");
                                }}
                                className="bg-emerald-950/60 text-amber-100 px-3 py-2 rounded-full font-semibold border border-emerald-600 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleMoveValidate}
                                disabled={
                                    moving ||
                                    selectedPokemons.length === 0 ||
                                    !destinationBoxId ||
                                    availableBoxes.length === 0
                                }
                                className="bg-amber-300 text-emerald-950 px-3 py-2 rounded-full font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                            >
                                {moving ? "Déplacement..." : "Valider le déplacement"}
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
