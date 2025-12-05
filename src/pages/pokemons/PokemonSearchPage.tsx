﻿import {type FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

interface PokemonSearchResult {
    id: number;
    trainerId: number;
    species: string;
    name: string;
    level: number;
    genderTypeCode: "MALE" | "FEMALE" | "NOT_DEFINED";
    size?: number | null;
    weight?: number | null;
    isShiny: boolean;
}

type SearchResponse = PokemonSearchResult[]; // l’API renvoie juste un tableau

export default function PokemonSearchPage() {
    const {token, trainerId} = useAuth();
    const navigate = useNavigate();

    // filtres
    const [species, setSpecies] = useState("");
    const [name, setName] = useState("");
    const [minLevel, setMinLevel] = useState<number | "">("");
    const [maxLevel, setMaxLevel] = useState<number | "">("");
    const [minSize, setMinSize] = useState<number | "">("");
    const [maxSize, setMaxSize] = useState<number | "">("");
    const [minWeight, setMinWeight] = useState<number | "">("");
    const [maxWeight, setMaxWeight] = useState<number | "">("");
    const [gender, setGender] = useState<
        "any" | "MALE" | "FEMALE" | "NOT_DEFINED"
    >("any");
    const [isShiny, setIsShiny] = useState<"any" | "true" | "false">("any");

    // résultats + pagination
    const [pokemons, setPokemons] = useState<PokemonSearchResult[]>([]);
    const [page, setPage] = useState(0); // 0-based
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageSize = 20;

    const fetchPokemons = async (pageToLoad = 0) => {
        if (!token) {
            setError("Vous devez être connecté pour rechercher des Pokémons.");
            return;
        }

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(pageToLoad));
        params.set("pageSize", String(pageSize));

        if (species.trim()) params.set("species", species.trim());
        if (name.trim()) params.set("name", name.trim());
        if (minLevel !== "") params.set("levelMin", String(minLevel));
        if (maxLevel !== "") params.set("levelMax", String(maxLevel));
        if (minSize !== "") params.set("sizeMin", String(minSize));
        if (maxSize !== "") params.set("sizeMax", String(maxSize));
        if (minWeight !== "") params.set("weightMin", String(minWeight));
        if (maxWeight !== "") params.set("weightMax", String(maxWeight));
        if (gender !== "any") params.set("gender", gender);
        if (isShiny !== "any") {
            params.set("isShiny", isShiny === "true" ? "true" : "false");
        }

        try {
            const res = await fetch(
                `http://localhost:8000/pokemons?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) {
                setError("Impossible de charger les Pokémons.");
                return;
            }

            const data: SearchResponse = await res.json();
            setPokemons(data);
            setPage(pageToLoad);
            // si l’API ne renvoie pas totalPages, on estime :
            setTotalPages(data.length === pageSize ? pageToLoad + 2 : pageToLoad + 1);
        } catch {
            setError("Impossible de joindre le serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPokemons(0);
        }
    }, [token]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        fetchPokemons(0);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) {
            fetchPokemons(page + 1);
        }
    };

    const handlePrev = () => {
        if (page > 0) {
            fetchPokemons(page - 1);
        }
    };

    const errorId = error ? "pokemon-search-error" : undefined;

    if (!token) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">
                    Rechercher des Pokémons
                </h1>
                <p role="alert">Vous devez être connecté pour accéder à cette page.</p>
            </main>
        );
    }

    return (
        <main
            className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-3xl font-extrabold text-amber-200 mb-2">
                    Rechercher des Pokémons
                </h1>

                {/* Filtres */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4 space-y-4"
                    aria-labelledby="search-filters-title"
                    aria-describedby={errorId}
                >
                    <h2
                        id="search-filters-title"
                        className="text-xl font-bold text-amber-200 mb-2"
                    >
                        Filtres
                    </h2>

                    {error && (
                        <div
                            id="pokemon-search-error"
                            role="alert"
                            aria-live="assertive"
                            className="mb-2 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
                        >
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Espèce */}
                        <div>
                            <label htmlFor="species" className="block font-semibold mb-1">
                                Espèce
                            </label>
                            <input
                                id="species"
                                type="text"
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                placeholder="Ex. Pikachu"
                            />
                        </div>

                        {/* Nom */}
                        <div>
                            <label htmlFor="name" className="block font-semibold mb-1">
                                Nom
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>

                        {/* Niveau min / max */}
                        <div>
                            <label htmlFor="minLevel" className="block font-semibold mb-1">
                                Niveau minimum
                            </label>
                            <input
                                id="minLevel"
                                type="number"
                                min={1}
                                max={100}
                                value={minLevel}
                                onChange={(e) =>
                                    setMinLevel(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxLevel" className="block font-semibold mb-1">
                                Niveau maximum
                            </label>
                            <input
                                id="maxLevel"
                                type="number"
                                min={1}
                                max={100}
                                value={maxLevel}
                                onChange={(e) =>
                                    setMaxLevel(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>

                        {/* Taille min / max */}
                        <div>
                            <label htmlFor="minSize" className="block font-semibold mb-1">
                                Taille minimum
                            </label>
                            <input
                                id="minSize"
                                type="number"
                                min={0}
                                step="0.01"
                                value={minSize}
                                onChange={(e) =>
                                    setMinSize(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxSize" className="block font-semibold mb-1">
                                Taille maximum
                            </label>
                            <input
                                id="maxSize"
                                type="number"
                                min={0}
                                step="0.01"
                                value={maxSize}
                                onChange={(e) =>
                                    setMaxSize(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>

                        {/* Poids min / max */}
                        <div>
                            <label htmlFor="minWeight" className="block font-semibold mb-1">
                                Poids minimum
                            </label>
                            <input
                                id="minWeight"
                                type="number"
                                min={0}
                                step="0.01"
                                value={minWeight}
                                onChange={(e) =>
                                    setMinWeight(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxWeight" className="block font-semibold mb-1">
                                Poids maximum
                            </label>
                            <input
                                id="maxWeight"
                                type="number"
                                min={0}
                                step="0.01"
                                value={maxWeight}
                                onChange={(e) =>
                                    setMaxWeight(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                        </div>

                        {/* Genre */}
                        <div>
                            <label htmlFor="gender" className="block font-semibold mb-1">
                                Genre
                            </label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) =>
                                    setGender(
                                        e.target.value as "any" | "MALE" | "FEMALE" | "NOT_DEFINED"
                                    )
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            >
                                <option value="any">Peu importe</option>
                                <option value="MALE">Mâle</option>
                                <option value="FEMALE">Femelle</option>
                                <option value="NOT_DEFINED">Neutre / non défini</option>
                            </select>
                        </div>

                        {/* Chromatique */}
                        <div>
                            <label htmlFor="isShiny" className="block font-semibold mb-1">
                                Chromatique
                            </label>
                            <select
                                id="isShiny"
                                value={isShiny}
                                onChange={(e) =>
                                    setIsShiny(e.target.value as "any" | "true" | "false")
                                }
                                className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            >
                                <option value="any">Peu importe</option>
                                <option value="true">Chromatique uniquement</option>
                                <option value="false">Non chromatique uniquement</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-full bg-amber-300 text-emerald-950 font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60"
                        >
                            Appliquer les filtres
                        </button>
                    </div>
                </form>

                {/* Résultats */}
                <section
                    aria-label="Résultats de la recherche de Pokémons"
                    className="bg-emerald-950/80 border border-emerald-700 rounded-xl p-4"
                >
                    {loading && (
                        <p aria-live="polite">Chargement des résultats…</p>
                    )}

                    {!loading && pokemons.length === 0 && (
                        <p>Aucun Pokémon ne correspond à ces filtres.</p>
                    )}

                    {!loading && pokemons.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-emerald-700 text-amber-200">
                                        <th className="text-left py-2 pr-2">Espèce</th>
                                        <th className="text-left py-2 pr-2">Nom</th>
                                        <th className="text-left py-2 pr-2">Niveau</th>
                                        <th className="text-left py-2 pr-2">Genre</th>
                                        <th className="text-left py-2 pr-2">Taille</th>
                                        <th className="text-left py-2 pr-2">Poids</th>
                                        <th className="text-left py-2 pr-2">Chromatique</th>
                                        <th className="text-left py-2 pr-2">Dresseur·euse</th>
                                        <th className="text-left py-2 pr-2">Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {pokemons.map((p) => {
                                        const isMine =
                                            trainerId && Number(trainerId) === p.trainerId;

                                        return (
                                            <tr
                                                key={p.id}
                                                className="border-b border-emerald-800 hover:bg-emerald-900/60"
                                            >
                                                <td className="py-2 pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/pokemon/${p.id}`)}
                                                        className="text-amber-200 underline underline-offset-2 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                                                    >
                                                        {p.species}
                                                    </button>
                                                </td>
                                                <td className="py-2 pr-2">{p.name}</td>
                                                <td className="py-2 pr-2">{p.level}</td>
                                                <td className="py-2 pr-2">
                                                    {p.genderTypeCode === "MALE"
                                                        ? "♂ Mâle"
                                                        : p.genderTypeCode === "FEMALE"
                                                            ? "♀ Femelle"
                                                            : "⚪ Neutre"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    {p.size != null ? p.size : "-"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    {p.weight != null ? p.weight : "-"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    {p.isShiny ? "Oui ✨" : "Non"}
                                                </td>
                                                <td className="py-2 pr-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/trainers/${p.trainerId}`)}
                                                        className="text-amber-300 underline underline-offset-2 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
                                                    >
                                                        #{p.trainerId}
                                                    </button>
                                                </td>
                                                <td className="py-2 pr-2">
                                                    {!isMine && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/trades/new?receiverId=${p.trainerId}&pokemonId=${p.id}`
                                                                )
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
                                    Précédents
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
                                    Suivants
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
