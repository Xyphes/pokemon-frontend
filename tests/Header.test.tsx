import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../src/components/Header";

describe("Header", () => {
    it("affiche un lien vers l'accueil Hyrule Boxes", () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("link", { name: /hyrule boxes/i })
        ).toBeInTheDocument();
    });
});
