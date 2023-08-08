import MainCarousel from "./MainCarousel";
import ShoppingList from "./ShoppingList";
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