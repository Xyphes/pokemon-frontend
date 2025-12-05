import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TrainerSearchPage from "../src/pages/trainer/TrainerSearchPage";

describe("TrainerSearchPage", () => {
    it("affiche un titre de recherche de dresseurs", () => {
        render(
            <BrowserRouter>
                <TrainerSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /rechercher des dresseur/i })
        ).toBeInTheDocument();
    });

    it("affiche un message demandant la connexion", () => {
        render(
            <BrowserRouter>
                <TrainerSearchPage />
            </BrowserRouter>
        );
        expect(
            screen.getByText(/vous devez être connecté/i)
        ).toBeInTheDocument();
    });
});
