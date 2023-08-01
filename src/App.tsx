import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes, useLocation,} from 'react-router-dom';
import Home from './scenes/home/Home';
import BookDetails from "./scenes/itemDetails/BookDetails";
import Checkout from "./scenes/checkout/Checkout";
import Navbar from "./scenes/global/navbar/Navbar";
import CartMenu from "./scenes/global/CartMenu";
import Footer from "./scenes/global/Footer";
import Account from "./scenes/account/Account";
import {useAppDispatch} from "./app/hooks";
import {fetchCategories} from "./state/book/bookReducer";
import BookFilter from "./scenes/bookFilter/BookFilter";
import {useAuth0} from "@auth0/auth0-react";
import {fetchRole, loginUser} from "./state/security/securityReducer";
import ManagerDashboard from "./scenes/managerDashboard/ManagerDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();
  const path = window.location.pathname;
  console.log(path);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        dispatch(loginUser(token));
        dispatch(fetchRole())
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently, dispatch]);

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
            <Route path="search/:phrase/:page" element={<BookFilter />} />
            <Route path=":categories/:page" element={<BookFilter />} />
            <Route path="/admin" element={<ManagerDashboard />} />
          </Routes>
          <CartMenu/>
          {path !== "/admin" && (
              <Footer/>
          )}
        </BrowserRouter>
    </div>
  );
}

export default App;
