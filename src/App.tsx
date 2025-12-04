import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Header from "./components/Header.tsx";
import SubscribePage from "./pages/SubscribePage.tsx";
import BoxesPage from "./pages/box/BoxesPage.tsx";
import CreateBoxPage from "./pages/box/CreateBoxPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import BoxDetailPage from "./pages/box/BoxDetailPage.tsx";
import AddPokemonPage from "./pages/pokemons/AddPokemonPage.tsx";
import PokemonDetailPage from "./pages/pokemons/PokemonDetail.tsx";
import AboutPage from "./pages/AboutPage.tsx";

function App() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/Home" element={<HomePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>


                <Route path="/" element={<Navigate to="/Home"/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SubscribePage/>}/>

                <Route path="/boxes" element={<BoxesPage/>}/>
                <Route path="/boxes/new" element={<CreateBoxPage/>}/>
                <Route path="/boxes/:boxId" element={<BoxDetailPage/>}/>


                <Route path="/boxes/:boxId/add-pokemon" element={<AddPokemonPage/>}/>
                <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage/>}/>


            </Routes></>
    );
}

export default App;
