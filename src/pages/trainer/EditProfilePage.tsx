import {type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface TrainerProfile {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string; // ISO
    login: string;
}

export default function EditProfilePage() {
    const { token, trainerId } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const passwordsMismatch =
        password !== "" || confirmPassword !== ""
            ? password !== confirmPassword
            : false;

    useEffect(() => {
        const fetchMe = async () => {
            if (!token || !trainerId) {
                setError("Vous devez être connecté pour modifier vos informations.");
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
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setBirthDate(data.birthDate.slice(0, 10)); // yyyy-mm-dd
            } catch {
                setError("Impossible de charger vos informations.");
            }
        };
        fetchMe();
    }, [token, trainerId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!token || !trainerId) {
            setError("Vous devez être connecté pour modifier vos informations.");
            return;
        }
        if (passwordsMismatch) return;

        setLoading(true);
        try {
            const body: any = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate,
            };
            if (password.trim()) {
                body.password = password.trim();
            }

            const res = await fetch(
                `http://localhost:8000/trainers/${trainerId}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) {
                setError("Impossible de modifier vos informations.");
                return;
            }

            navigate("/profile");
        } catch {
            setError("Erreur lors de la modification.");
        } finally {
            setLoading(false);
        }
    };

    const errorId = error ? "edit-profile-error" : undefined;
    const passwordErrorId = passwordsMismatch
        ? "password-mismatch-error"
        : undefined;

    return (
        <main className="min-h-screen p-4 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-amber-100">
        <section
            className="max-w-xl mx-auto bg-emerald-950/80 border border-emerald-700 rounded-xl p-6"
    aria-labelledby="edit-profile-title"
    aria-describedby={errorId}
    >
    <h1
        id="edit-profile-title"
    className="text-3xl font-extrabold text-amber-200 mb-4"
        >
        Modifier mes informations
    </h1>

    {error && (
        <div
            id="edit-profile-error"
        role="alert"
        aria-live="assertive"
        className="mb-4 text-red-100 bg-red-900/70 border border-red-500 px-3 py-2 rounded-lg"
            >
            {error}
            </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
    {/* Prénom */}
    <div>
    <label
        htmlFor="firstName"
    className="block font-semibold mb-1 text-amber-100"
        >
        Prénom
        </label>
        <input
    id="firstName"
    type="text"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    required
    className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        </div>

    {/* Nom */}
    <div>
        <label
            htmlFor="lastName"
    className="block font-semibold mb-1 text-amber-100"
        >
        Nom de famille
    </label>
    <input
    id="lastName"
    type="text"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    required
    className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        </div>

    {/* Date de naissance */}
    <div>
        <label
            htmlFor="birthDate"
    className="block font-semibold mb-1 text-amber-100"
        >
        Date de naissance
    </label>
    <input
    id="birthDate"
    type="date"
    value={birthDate}
    onChange={(e) => setBirthDate(e.target.value)}
    required
    className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        </div>

    {/* Mot de passe */}
    <div>
        <label
            htmlFor="password"
    className="block font-semibold mb-1 text-amber-100"
        >
        Mot de passe
    </label>
    <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    aria-describedby={passwordErrorId ?? undefined}
    className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        </div>

    {/* Confirmer le mot de passe */}
    <div>
        <label
            htmlFor="confirmPassword"
    className="block font-semibold mb-1 text-amber-100"
        >
        Confirmer le mot de passe
    </label>
    <input
    id="confirmPassword"
    type="password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    aria-describedby={passwordErrorId ?? undefined}
    className="w-full border-2 border-emerald-700 rounded-lg px-3 py-2 bg-emerald-950 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        </div>

    {passwordsMismatch && (
        <p
            id="password-mismatch-error"
        role="alert"
        className="text-sm text-red-200"
            >
            Les mots de passe ne sont pas identiques.
    </p>
    )}

    <button
        type="submit"
    disabled={loading || passwordsMismatch}
    className={`w-full mt-2 py-2.5 rounded-full font-bold text-lg text-emerald-950 bg-amber-300 border-2 border-amber-700 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-60`}
>
    {loading ? "Modification..." : "Modifier mes informations"}
    </button>
    </form>
    </section>
    </main>
);
}
