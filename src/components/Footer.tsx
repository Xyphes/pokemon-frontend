import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            className="w-full border-t border-emerald-800 bg-emerald-950/90 text-amber-100"
    aria-label="Pied de page du site"
    >
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center text-sm">
    <span className="text-amber-300/80">
        Hyrule Boxes • Gestion de coffres et de Pokémons
    </span>
    <Link
    to="/about"
    className="text-amber-300 underline underline-offset-2 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded px-1"
        >
        À propos
    </Link>
    </div>
    </footer>
);
}
