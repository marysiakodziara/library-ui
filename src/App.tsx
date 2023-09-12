import React, {useEffect} from 'react';
import {Route, Routes, useLocation,} from 'react-router-dom';
import Home from './scenes/home/Home';
import BookDetails from "./scenes/itemDetails/BookDetails";
import Checkout from "./scenes/checkout/Checkout";
import Navbar from "./scenes/navbar/Navbar";
import CartMenu from "./scenes/global/CartMenu";
import Footer from "./scenes/global/Footer";
import Account from "./scenes/account/Account";
import {useAppDispatch} from "./app/hooks";
import {fetchCategories} from "./state/book/bookReducer";
import BookFilter from "./scenes/bookFilter/BookFilter";
import {useAuth0} from "@auth0/auth0-react";
import {initializeSecurity, loginUser} from "./state/security/securityReducer";
import ManagerDashboard from "./scenes/managerDashboard/ManagerDashboard";
import PrivateRoutes from "./scenes/global/PrivateRoutes";
import {setItems} from "./state/cart/cartReducer";
import BookClub from "./scenes/bookClub/BookClub";
import {ROUTES} from "./routes/routes";
import {Box} from "@mui/material";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setItems());
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeSecurity());
    const fetchToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const role = user?.nickname;

        dispatch(loginUser({token, role}));
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently, dispatch]);

  const styles = {
    app: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }
  }

  return (
    <Box sx={styles.app} >
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.BOOK} element={<BookDetails />} />
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTES.ACCOUNT} element={<Account />} />
            <Route path={ROUTES.SEARCH} element={<BookFilter />} />
            <Route path={ROUTES.CATEGORIES} element={<BookFilter />} />
            <Route path={ROUTES.BOOK_CLUB} element={<BookClub />} />
            <Route element={<PrivateRoutes/>}>
              <Route path={ROUTES.ADMIN} element={<ManagerDashboard />} />
            </Route>
          </Routes>
          <CartMenu/>
          <Footer/>
    </Box >
  );
}

export default App;
