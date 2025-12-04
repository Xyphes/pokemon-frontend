import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface TrainerProfile {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    login: string;
}

export default function ProfilePage() {
    const { token, trainerId: currentTrainerId } = useAuth();
    const { trainerId } = useParams<{ trainerId: string }>();
    const navigate = useNavigate();

    const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMe =
        trainer && currentTrainerId
            ? Number(currentTrainerId) === trainer.id
            : false;

    useEffect(() => {
        const fetchTrainer = async () => {
            if (!token || !trainerId) {
                setError("Vous devez être connecté pour voir ce profil.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:8000/trainers/${trainerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (!res.ok) throw new Error();
                const data: TrainerProfile = await res.json();
                setTrainer(data);
            } catch {
                setError("Impossible de charger ce profil.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainer();
    }, [token, trainerId]);

    if (loading) {
        return (
            <main
                className="min-h-screen p-4 bg-emerald-950 text-amber-100"
                aria-busy="true"
            >
                <h1 className="text-3xl font-extrabold mb-4">Profil dresseur·euse</h1>
                <p>Chargement…</p>
            </main>
        );
    }

    if (error || !trainer) {
        return (
            <main className="min-h-screen p-4 bg-emerald-950 text-amber-100">
                <h1 className="text-3xl font-extrabold mb-4">Profil dresseur·euse</h1>
                <p role="alert" className="text-red-200 mb-4">
                    {error ?? "Profil introuvable."}
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

    const formattedBirthDate = new Date(trainer.birthDate).toLocaleDateString();

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
            <section
                className="max-w-xl mx-auto bg-emerald-950/80 border border-emerald-700 rounded-xl p-6 space-y-4"
                aria-labelledby="profile-title"
            >
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h1
                        id="profile-title"
                        className="text-3xl font-extrabold text-amber-200"
                    >
                        Profil de {trainer.login}
                    </h1>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-emerald-900 border border-amber-500 text-amber-100 px-4 py-2 rounded-full font-semibold hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    >
                        Retour
                    </button>
                </div>

                <div className="space-y-2">
                    <p>
                        <span className="font-semibold text-amber-200">Prénom :</span>{" "}
                        {trainer.firstName}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Nom :</span>{" "}
                        {trainer.lastName}
                    </p>
                    <p>
            <span className="font-semibold text-amber-200">
              Date de naissance :
            </span>{" "}
                        {formattedBirthDate}
                    </p>
                    <p>
                        <span className="font-semibold text-amber-200">Login :</span>{" "}
                        {trainer.login}
                    </p>
                </div>

                {isMe && (
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/profile/${trainer.id}/edit`)}
                            className="bg-amber-300 text-emerald-950 px-4 py-2 rounded-full font-bold border-2 border-amber-600 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                        >
                            Modifier mes informations
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
