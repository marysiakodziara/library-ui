import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./state/cart/cartReducer";
import { Auth0Provider } from '@auth0/auth0-react'
import {store} from "./app/store";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Auth0Provider
                domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
                clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                }}
            >
                <CssBaseline />
                <App />
            </Auth0Provider>
        </ThemeProvider>
      </Provider>
  </React.StrictMode>
);

