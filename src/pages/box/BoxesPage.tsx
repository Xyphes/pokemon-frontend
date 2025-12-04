import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

interface Box {
    id: number;
    name: string;
}

export default function BoxesPage() {
    const { token, trainerId } = useAuth();
    const navigate = useNavigate();
    const [boxes, setBoxes] = useState<Box[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);




    useEffect(() => {
        const fetchBoxes = async () => {
            setLoading(true);
            setError(null);

            if (!token || !trainerId) {
                setError("Vous devez être connecté pour voir vos boîtes.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:8000/trainers/${trainerId}/boxes`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error();
                }

                const data: Box[] = await res.json();
                setBoxes(data);
            } catch {
                setError("Impossible de charger vos boîtes.");
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();
    }, [token, trainerId]);

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Coffres d&apos;Hyrule
                </h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4 text-amber-200">
                    Coffres d&apos;Hyrule
                </h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-extrabold text-amber-200">
                        Coffres d&apos;Hyrule
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate("/boxes/new")}
                        className="bg-amber-300 text-emerald-950 px-4 py-2 rounded-full font-bold border-2 border-amber-600 shadow-[0_3px_0_rgba(0,0,0,0.6)] hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(0,0,0,0.6)]"
                    >
                        Ajouter un coffre
                    </button>
                </div>

                {boxes.length === 0 ? (
                    <p>Aucun coffre pour le moment.</p>
                ) : (
                    <ul
                        className="space-y-3"
                        aria-label="Liste de vos coffres d'Hyrule"
                    >
                        {boxes.map((box) => (
                            <li key={box.id}>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/boxes/${box.id}`)}
                                    className="w-full text-left border border-emerald-800 rounded-xl p-3 bg-emerald-950/70 shadow-[0_3px_0_rgba(0,0,0,0.7)] hover:bg-emerald-800/80 focus:outline-none focus:ring-2 focus:ring-amber-300"
                                    aria-label={`Voir le détail du coffre ${box.name}`}
                                >
                                    <h2 className="font-semibold text-amber-200">
                                        {box.name}
                                    </h2>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
