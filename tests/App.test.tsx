import { render } from "@testing-library/react";
import App from "../src/App";
import { MemoryRouter } from "react-router-dom";

test("App renders without crashing", () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
});
