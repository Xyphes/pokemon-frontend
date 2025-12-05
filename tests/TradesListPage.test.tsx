// tests/TradesListPage.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import TradesListPage from "../src/pages/trades/TradesListPage";
import { AuthProvider } from "../src/context/AuthContext";

describe("TradesListPage", () => {
    beforeEach(() => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        } as any);
    });

    afterEach(() => {
        (global.fetch as any).mockRestore();
    });

    it("affiche le titre des échanges", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TradesListPage />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /échanges/i })
        ).toBeInTheDocument();
    });
});
