// tests/SubscribePage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SubscribePage from "../src/pages/SubscribePage";

const renderSubscribe = () =>
    render(
        <BrowserRouter>
            <SubscribePage />
        </BrowserRouter>
    );

describe("SubscribePage", () => {
    it("affiche le titre d'inscription", () => {
        renderSubscribe();
        expect(
            screen.getByRole("heading", { name: /inscription/i })
        ).toBeInTheDocument();
    });

    it("affiche le champ adresse email", () => {
        renderSubscribe();
        expect(
            screen.getByLabelText(/adresse email/i)
        ).toBeInTheDocument();
    });
});
