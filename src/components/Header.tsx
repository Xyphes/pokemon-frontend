import {Link, NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../context/AuthContext";

export default function Header() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const {logged, logout, trainerId} = useAuth();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/login");
    };

    const closeMenu = () => setOpen(false);

    return (
        <header
            className=" top-0 left-0 right-0 z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-amber-100 shadow-[0_4px_0_rgba(0,0,0,0.45)] border-b border-amber-700/40">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold tracking-wide"
                >
          <span className="inline-flex items-center gap-2">
            <img
                src="/triforce.png"
                alt="Triforce"
                className="w-14 h-8 drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
            />
            <span className="text-amber-200 drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]">
              Hyrule Boxes
            </span>
          </span>
                </Link>

                <nav
                    className="hidden md:flex items-center gap-5"
                    aria-label="Navigation principale"
                >
                    {logged && (
                        <NavItem to="/boxes" label="Mes boîtes" onClick={closeMenu}/>
                    )}
                    {logged && (
                        <NavItem to="/trades" label="Mes échanges" onClick={closeMenu}/>
                    )}
                    {logged && (
                        <NavItem
                            to="/trainers"
                            label="Chercher un·e Dresseur·euse"
                            onClick={closeMenu}
                        />
                    )}
                    {logged && (
                        <NavItem
                            to="/pokemon"
                            label="Chercher un Pokémon"
                            onClick={closeMenu}
                        />
                    )}
                    {logged && (
                        <NavItem
                            to={`/profile/${trainerId}`}
                            label="Profil utilisateur·ice·s"
                            onClick={closeMenu}
                        />
                    )}

                    {!logged && (
                        <NavItem to="/login" label="Connexion" onClick={closeMenu}/>
                    )}
                    {!logged && (
                        <NavItem to="/signup" label="Inscription" onClick={closeMenu}/>
                    )}

                    <NavItem to="/about" label="À propos" onClick={closeMenu}/>

                    {logged && (
                        <button
                            onClick={handleLogout}
                            className="text-sm md:text-base font-semibold px-3 py-1.5 rounded-full border border-amber-500 bg-emerald-950/60 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        >
                            Deconnexion
                        </button>
                    )}
                </nav>

                <button
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label="Menu principal"
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full border border-amber-500 bg-emerald-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
          <span
              className={`block w-6 h-0.5 bg-amber-100 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-1.5" : ""
              }`}
          />
                    <span
                        className={`block w-6 h-0.5 bg-amber-100 my-1 transition-all duration-300 ${
                            open ? "opacity-0" : "opacity-100"
                        }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-amber-100 transition-all duration-300 ${
                            open ? "-rotate-45 -translate-y-1.5" : ""
                        }`}
                    />
                </button>
            </div>

            <nav
                id="mobile-menu"
                className={`md:hidden top-[64px] left-0 right-0 z-30 bg-emerald-950/95 border-t border-amber-700/40 overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96" : "max-h-0"
                }`}
                aria-label="Navigation principale mobile"
            >
                {logged && (
                    <MobileNavItem to="/boxes" label="Mes boîtes" onClick={closeMenu}/>
                )}
                {logged && (
                    <MobileNavItem to="/trades" label="Mes échanges" onClick={closeMenu}/>
                )}
                {logged && (
                    <MobileNavItem
                        to="/trainers"
                        label="Chercher un·e Dresseur·euse"
                        onClick={closeMenu}
                    />
                )}
                {logged && (
                    <MobileNavItem
                        to="/pokemon"
                        label="Chercher un Pokémon"
                        onClick={closeMenu}
                    />
                )}
                {logged && (
                    <MobileNavItem
                        to={`/profile/${trainerId}`}
                        label="Profil utilisateur·ice·s"
                        onClick={closeMenu}
                    />
                )}

                {!logged && (
                    <MobileNavItem to="/login" label="Connexion" onClick={closeMenu}/>
                )}
                {!logged && (
                    <MobileNavItem to="/signup" label="Inscription" onClick={closeMenu}/>
                )}

                <MobileNavItem to="/about" label="À propos" onClick={closeMenu}/>

                {logged && (
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-base font-semibold text-amber-200 hover:bg-emerald-800/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                        Deconnexion
                    </button>
                )}
            </nav>
        </header>
    );
}

function NavItem({
                     to,
                     label,
                     onClick,
                 }: {
    to: string;
    label: string;
    onClick?: () => void;
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({isActive}) =>
                `text-sm md:text-base font-semibold px-3 py-1.5 rounded-full border transition 
        ${
                    isActive
                        ? "bg-amber-300 text-emerald-950 border-amber-200"
                        : "border-transparent text-amber-100 hover:bg-emerald-800 hover:border-amber-300"
                }`
            }
        >
            {label}
        </NavLink>
    );
}

function MobileNavItem({
                           to,
                           label,
                           onClick,
                       }: {
    to: string;
    label: string;
    onClick?: () => void;
}) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({isActive}) =>
                `block px-4 py-3 text-base border-b border-emerald-900 transition 
        ${
                    isActive
                        ? "bg-emerald-800 text-amber-300 font-semibold"
                        : "text-amber-100 hover:bg-emerald-800"
                }`
            }
        >
            {label}
        </NavLink>
    );
}
