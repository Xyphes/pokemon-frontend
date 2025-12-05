import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "../src/pages/trainer/ProfilePage";
import { AuthProvider } from "../src/context/AuthContext";

describe("ProfilePage", () => {
    it("affiche le profil (titre ou heading)", () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <ProfilePage />
                </AuthProvider>
            </BrowserRouter>
        );
        expect(
            screen.getByRole("heading", { name: /profil/i })
        ).toBeInTheDocument();
    });
});
