import MainCarousel from "./components/MainCarousel";
import ShoppingList from "./components/ShoppingList";
import {useEffect} from "react";

const Home = () => {

    useEffect(() => {
    }, []);

    return (
        <div className="home">
            <MainCarousel />
            <ShoppingList />
        </div>
    );
}

export default Home;