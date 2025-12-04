import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { logged, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setOpen(false);   // ⬅️ important !
        navigate("/login");
    };


    console.log("Header logged =", logged);

    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
                <Link to="/" className="text-2xl font-bold tracking-wide">
                    Pokémon Boxes
                </Link>

                <nav className="hidden md:flex gap-6">
                    {logged && <NavItem to="/boxes" label="Mes boîtes" />}
                    {logged && <NavItem to="/trades" label="Mes échanges" />}
                    {logged && <NavItem to="/trainers" label="Chercher un·e Dresseur·euse" />}
                    {logged && <NavItem to="/pokemon" label="Chercher un Pokémon" />}
                    {logged && <NavItem to="/profile" label="Profil" />}

                    {!logged && <NavItem to="/login" label="Connexion" />}
                    {!logged && <NavItem to="/signup" label="Inscription" />}

                    {logged && (
                        <button
                            onClick={handleLogout}
                            className="text-lg hover:text-red-400 transition"
                        >
                            Déconnexion
                        </button>
                    )}
                </nav>

                <button
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-label="Menu"
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10"
                >
                    <span
                        className={`block w-7 h-0.5 bg-white transition-all duration-300 ${
                            open ? "rotate-45 translate-y-1.5" : ""
                        }`}
                    ></span>
                    <span
                        className={`block w-7 h-0.5 bg-white my-1 transition-all duration-300 ${
                            open ? "opacity-0" : "opacity-100"
                        }`}
                    ></span>
                    <span
                        className={`block w-7 h-0.5 bg-white transition-all duration-300 ${
                            open ? "-rotate-45 -translate-y-1.5" : ""
                        }`}
                    ></span>
                </button>
            </div>

            <nav
                className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96" : "max-h-0"
                }`}
            >
                {logged && <MobileNavItem to="/boxes" label="Mes boîtes" />}
                {logged && <MobileNavItem to="/trades" label="Mes échanges" />}
                {logged && <MobileNavItem to="/trainers" label="Chercher un·e Dresseur·euse" />}
                {logged && <MobileNavItem to="/pokemon" label="Chercher un Pokémon" />}
                {logged && <MobileNavItem to="/profile" label="Profil" />}

                {!logged && <MobileNavItem to="/login" label="Connexion" />}
                {!logged && <MobileNavItem to="/signup" label="Inscription" />}

                {logged && (
                    <button
                        onClick={handleLogout}
                        className="block px-4 py-4 text-lg w-full text-left hover:text-red-400 transition"
                    >
                        Déconnexion
                    </button>
                )}
            </nav>
        </header>
    );
}

function NavItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `text-lg hover:text-gray-300 transition ${
                    isActive ? "font-semibold text-yellow-400" : ""
                }`
            }
        >
            {label}
        </NavLink>
    );
}

function MobileNavItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block px-4 py-4 text-lg border-b border-gray-700 hover:bg-gray-700 transition ${
                    isActive ? "bg-gray-700 font-semibold text-yellow-400" : ""
                }`
            }
        >
            {label}
        </NavLink>
    );
}
