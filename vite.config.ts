import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/setupTests.ts",
        include: ["tests/**/*.test.{ts,tsx}"], // <– tous les tests dans /tests
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            reporter: ["text", "html"],
            thresholds: {
                lines: 75,
                functions: 75,
                branches: 75,
                statements: 75,
            },
        },
    },
});
