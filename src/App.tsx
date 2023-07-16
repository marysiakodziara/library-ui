import React from 'react';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Home from './scenes/home/Home';
import BookDetails from "./scenes/itemDetails/bookDetails";
import Checkout from "./scenes/checkout/Checkout";
import Confirmation from "./scenes/checkout/Confirmation";
import Navbar from "./scenes/global/navbar/Navbar";
import CartMenu from "./scenes/global/CartMenu";
import Footer from "./scenes/global/Footer";
import Account from "./scenes/account/Account";
import {useAppDispatch} from "./app/hooks";
import {fetchBooks, fetchCategories} from "./state/book/bookReducer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="app">
        <BrowserRouter>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="item/:itemId" element={<BookDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="checkout/success" element={<Confirmation />} />
            <Route path="account" element={<Account />} />
          </Routes>
          <CartMenu/>
          <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;
