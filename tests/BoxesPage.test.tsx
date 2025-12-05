import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BoxesPage from "../src/pages/box/BoxesPage";
import { AuthProvider } from "../src/context/AuthContext";

describe("BoxesPage", () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        } as any);
    });

    afterEach(() => {
        (global.fetch as any).mockRestore();
    });

    it("affiche un titre pour les coffres", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <BoxesPage />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /coffres d'hyrule/i })
        ).toBeInTheDocument();
    });
});
