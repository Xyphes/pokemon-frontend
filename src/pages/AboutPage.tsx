export default function AboutPage() {
    return (
        <main className="min-h-screen bg-emerald-950 text-amber-100 p-4 flex justify-center">
            <section
                className="max-w-2xl w-full bg-emerald-900/80 border border-amber-500 rounded-xl p-6"
                aria-labelledby="about-title"
            >
                <h1 id="about-title" className="text-3xl font-extrabold mb-4">
                    À propos d’Hyrule Boxes
                </h1>
                <p>
                    Hyrule Boxes est une application pour gérer des coffres de créatures,
                    inspirée de l’univers de Zelda.
                </p>
                <p>
                    Made by Willy Somkhit
                </p>
            </section>
        </main>
    );
}
