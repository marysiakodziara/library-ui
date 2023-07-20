import React from 'react';
import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation, useParams,
} from 'react-router-dom';
import Home from './scenes/home/Home';
import BookDetails from "./scenes/itemDetails/BookDetails";
import Checkout from "./scenes/checkout/Checkout";
import Navbar from "./scenes/global/navbar/Navbar";
import CartMenu from "./scenes/global/CartMenu";
import Footer from "./scenes/global/Footer";
import Account from "./scenes/account/Account";
import {useAppDispatch} from "./app/hooks";
import {fetchBooks, fetchCategories} from "./state/book/bookReducer";
import BookFilter from "./scenes/bookFilter/BookFilter";

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
      dispatch(fetchCategories());
    }, [dispatch]);

  return (
    <div className="app">
        <BrowserRouter>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="book/:bookId" element={<BookDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<Account />} />
            <Route path="account/:tab" element={<Account />} />
            <Route path="search/:phrase/:page" element={<BookFilter />} />
            <Route path=":categories/:page" element={<BookFilter />} />
          </Routes>
          <CartMenu/>
          <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default App;
