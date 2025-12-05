import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AboutPage from "../src/pages/AboutPage";

describe("AboutPage", () => {
    it("affiche le titre À propos", () => {
        render(
            <BrowserRouter>
                <AboutPage />
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /à propos/i })
        ).toBeInTheDocument();
    });
});
