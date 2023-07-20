import MainCarousel from "./MainCarousel";
import ShoppingList from "./ShoppingList";
import Subscribe from "./Subscribe";
import {useEffect} from "react";

const Home = () => {

    useEffect(() => {

    }, []);
    return (
        <div className="home">
            <MainCarousel />
            <ShoppingList />
            <Subscribe />
        </div>
    );
}

export default Home;