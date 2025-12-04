export default function HomePage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-4">
            <section
                aria-labelledby="home-title"
                className="w-full max-w-3xl flex flex-col items-center gap-6"
            >
                <h1
                    id="home-title"
                    className="text-3xl md:text-4xl font-extrabold text-amber-200 text-center"
                >
                    Hyrule Boxes
                </h1>

                <img
                    src="zelda.gif"
                    alt="Animation inspirée de The Legend of Zelda"
                    className="max-h-80 rounded-xl border-2 border-amber-400 shadow-[0_0_20px_rgba(0,0,0,0.8)] object-contain"
                />

                <p className="text-amber-100/90 text-center max-w-xl">
                    You've met with a terrible fate, haven't you?.
                </p>
            </section>
        </main>
    );
}
