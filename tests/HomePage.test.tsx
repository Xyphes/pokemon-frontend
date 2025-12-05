// tests/HomePage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../src/pages/HomePage";

const renderHome = () =>
    render(
        <BrowserRouter>
            <HomePage />
        </BrowserRouter>
    );

describe("HomePage", () => {
    it("affiche le titre Hyrule Boxes", () => {
        renderHome();
        expect(
            screen.getByRole("heading", { name: /hyrule boxes/i })
        ).toBeInTheDocument();
    });

    it("affiche le texte de description Zelda", () => {
        renderHome();
        expect(screen.getByText(/terrible fate/i)).toBeInTheDocument();
    });
});
