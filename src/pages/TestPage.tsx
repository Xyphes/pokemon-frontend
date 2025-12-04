export default function TestPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
            <h1 className="text-4xl font-bold text-white mb-4">
                Test Tailwind 🚀
            </h1>

            <p className="text-gray-300 mb-8">
                Si tu vois cette page stylée, Tailwind fonctionne !
            </p>

            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition">
                Bouton Tailwind
            </button>
        </div>
    );
}
