import { Routes, Route, Navigate } from 'react-router-dom';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import Header from "./components/Header.tsx";
import SubscribePage from "./pages/SubscribePage.tsx";

function App() {
    return (
        <>
            <Header/>
            <Routes>
            <Route path="/" element={<Navigate to="/test"/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SubscribePage/>}/>
            <Route path="/boxes" element={<div>Liste des boîtes</div>}/>

            {/* Test Tailwind */}
            <Route path="/test" element={<TestPage/>}/>
        </Routes></>
    );
}

export default App;
