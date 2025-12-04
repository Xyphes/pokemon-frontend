import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import {AuthProvider} from "./context/AuthContext.tsx";

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error("Impossible de trouver #root");
}

ReactDOM.createRoot(rootElement!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

