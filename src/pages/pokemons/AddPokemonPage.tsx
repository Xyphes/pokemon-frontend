import {
    type FormEvent,
    useState,
    useRef,
    useEffect,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AddPokemonPage() {
    const { token } = useAuth();
    const { boxId } = useParams<{ boxId: string }>();
    const navigate = useNavigate();

    const [species, setSpecies] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "NOT_DEFINED">(
        "NOT_DEFINED"
    );
    const [level, setLevel] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [isShiny, setIsShiny] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const speciesRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        speciesRef.current?.focus();
    }, []);

    useEffect(() => {
        if (error) errorRef.current?.focus();
    }, [error]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token || !boxId) {
            setError("Vous devez être connecté pour créer un Pokémon.");
            return;
        }

        if (!species.trim()) {
            setError("L'espèce est obligatoire.");
            return;
        }

        if (level === "" || Number(level) < 1 || Number(level) > 100) {
            setError("Le niveau doit être un nombre entre 1 et 100.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8000/pokemons`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        species: species.trim(),
                        // si name vide -> on met species
                        name: name.trim() === "" ? species.trim() : name.trim(),
                        genderTypeCode: gender,
                        level: Number(level),
                        size: height === "" ? null : Number(height),
                        weight: weight === "" ? null : Number(weight),
                        isShiny,
                    }),
                }
            );

            if (!res.ok) {
                if (res.status === 400) {
                    setError("Les données du Pokémon sont invalides.");
                } else {
                    setError("Une erreur est survenue. Réessayez plus tard.");
                }
                return;
            }

            const created = await res.json();
            navigate(`/pokemon/${created.id}`);
        } catch {
            setError("Impossible de contacter le serveur.");
        } finally {
            setLoading(false);
        }
    };

    const errorId = error ? "add-pokemon-error" : undefined;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-emerald-950/95 border-2 border-amber-500 rounded-2xl shadow-[0_0_0_3px_rgba(0,0,0,0.7)] px-6 py-7"
                aria-labelledby="add-pokemon-title"
                aria-describedby={errorId}
            >
                <h1
                    id="add-pokemon-title"
                    className="text-3xl font-extrabold mb-6 text-center text-amber-200 tracking-wide"
                >
                    Nouveau Pokémon
                </h1>

                {error && (
                    <div
                        ref={errorRef}
                        id="add-pokemon-error"
                        role="alert"
                        aria-live="assertive"
                        tabIndex={-1}
                        className="mb-4 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
                    >
                        {error}
                    </div>
                )}

                {/* Espèce */}
                <div className="mb-4">
                    <label
                        htmlFor="species"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Espèce
                    </label>
                    <input
                        id="species"
                        name="species"
                        type="text"
                        ref={speciesRef}
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        required
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                        placeholder="Ex. Pikachu"
                    />
                </div>

                {/* Nom (optionnel) */}
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Nom (optionnel)
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 placeholder-emerald-400 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                        placeholder="Ex. Sparky"
                    />
                </div>

                {/* Genre */}
                <div className="mb-4">
                    <label
                        htmlFor="gender"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Genre
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={gender}
                        onChange={(e) =>
                            setGender(
                                e.target.value as "MALE" | "FEMALE" | "NOT_DEFINED"
                            )
                        }
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    >
                        <option value="NOT_DEFINED">Neutre / non défini</option>
                        <option value="MALE">Mâle</option>
                        <option value="FEMALE">Femelle</option>
                    </select>
                </div>

                {/* Niveau */}
                <div className="mb-4">
                    <label
                        htmlFor="level"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Niveau (1 à 100)
                    </label>
                    <input
                        id="level"
                        name="level"
                        type="number"
                        min={1}
                        max={100}
                        value={level}
                        onChange={(e) =>
                            setLevel(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        required
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                {/* Taille */}
                <div className="mb-4">
                    <label
                        htmlFor="height"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Taille
                    </label>
                    <input
                        id="height"
                        name="height"
                        type="number"
                        min={0}
                        step="0.01"
                        value={height}
                        onChange={(e) =>
                            setHeight(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                {/* Poids */}
                <div className="mb-4">
                    <label
                        htmlFor="weight"
                        className="block font-semibold mb-2 text-amber-100"
                    >
                        Poids
                    </label>
                    <input
                        id="weight"
                        name="weight"
                        type="number"
                        min={0}
                        step="0.01"
                        value={weight}
                        onChange={(e) =>
                            setWeight(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-300/70 focus:border-amber-400"
                    />
                </div>

                {/* Chromatique */}
                <div className="mb-6 flex items-center gap-2">
                    <input
                        id="isShiny"
                        name="isShiny"
                        type="checkbox"
                        checked={isShiny}
                        onChange={(e) => setIsShiny(e.target.checked)}
                        className="w-4 h-4 border-2 border-emerald-700 rounded bg-emerald-950 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/70"
                    />
                    <label htmlFor="isShiny" className="text-amber-100">
                        Chromatique
                    </label>
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
                    {loading ? "Création..." : "Créer le Pokémon"}
                </button>
            </form>
        </main>
    );
}
