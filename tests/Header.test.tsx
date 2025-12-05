import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../src/components/Header";
import { AuthProvider } from "../src/context/AuthContext";

const renderHeader = () =>
    render(
        <BrowserRouter>
            <AuthProvider>
                <Header />
            </AuthProvider>
        </BrowserRouter>
    );

describe("Header", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("affiche un lien vers l'accueil Hyrule Boxes", () => {
        renderHeader();
        expect(
            screen.getByRole("link", { name: /hyrule boxes/i })
        ).toBeInTheDocument();
    });

    it("affiche au moins un lien vers la page d'inscription quand déconnecté", () => {
        renderHeader();
        const links = screen.getAllByRole("link", { name: /inscription/i });
        expect(links.length).toBeGreaterThan(0);
    });

    it("affiche au moins un lien vers la page de connexion quand déconnecté", () => {
        renderHeader();
        const links = screen.getAllByRole("link", { name: /connexion/i });
        expect(links.length).toBeGreaterThan(0);
    });

    it("ouvre le menu mobile quand on clique sur le bouton", () => {
        const { container } = renderHeader();
        const button = screen.getByRole("button", { name: /menu principal/i });
        const nav = container.querySelector("#mobile-menu")!;
        expect(nav.className).toContain("max-h-0");

        fireEvent.click(button);

        expect(nav.className).toContain("max-h-96");
    });

});
