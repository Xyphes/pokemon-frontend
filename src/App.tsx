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
import PokemonSearchPage from "./pages/pokemons/PokemonSearchPage.tsx";
import Footer from "./components/Footer.tsx";
import ProfilePage from "./pages/trainer/ProfilePage.tsx";
import EditProfilePage from "./pages/trainer/EditProfilePage.tsx";
import TrainerSearchPage from "./pages/trainer/TrainerSearchPage.tsx";
import TradeCreatePage from "./pages/trades/TradeCreatePage.tsx";
import TradesListPage from "./pages/trades/TradesListPage.tsx";
import TradeDetailPage from "./pages/trades/TradeDetailPage.tsx";

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
                <Route path="/pokemon" element={<PokemonSearchPage/>}/>


                <Route path="/profile/:trainerId" element={<ProfilePage/>}/>
                <Route path="/profile/edit" element={<EditProfilePage/>}/>

                <Route path="/trainers" element={<TrainerSearchPage/>}/>

                <Route path="/trades/new" element={<TradeCreatePage/>}/>
                <Route path="/trades" element={<TradesListPage/>}/>
                <Route path="/trades/:tradeId" element={<TradeDetailPage/>}/>


            </Routes>
            <Footer/>
        </>
    );
}

export default App;
