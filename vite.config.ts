import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: [
                "src/App.tsx",
                "src/components/**/*.tsx",
                "src/context/**/*.tsx",
                "src/pages/**/*.tsx",
                "src/api.ts",
            ],
            exclude: [
                "src/main.tsx",
                "src/types/**",
            ],
        },
    },
});
