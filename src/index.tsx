import React, {PropsWithChildren} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ThemeProvider} from '@mui/material/styles';
import {CssBaseline} from '@mui/material';
import {theme} from './theme';
import {Provider} from 'react-redux';
import {AppState, Auth0Provider, Auth0ProviderOptions} from '@auth0/auth0-react'
import {store} from "./app/store";
import {BrowserRouter, useNavigate} from "react-router-dom";

const Auth0ProviderWithRedirectCallback = ({
                                               children,
                                               ...props
                                           }: PropsWithChildren<Auth0ProviderOptions>) => {
    const navigate = useNavigate();

    const onRedirectCallback = (appState?: AppState) => {
        const path: string = appState?.returnTo ? appState.returnTo : "/";
        navigate(path);
    }

    return (
        <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
            {children}
        </Auth0Provider>
    );
};




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Auth0ProviderWithRedirectCallback
                    domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
                    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
                    authorizationParams={{
                        redirect_uri: window.location.origin,
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE as string,
                    }}
                >
                    <CssBaseline />
                        <App />
                </Auth0ProviderWithRedirectCallback>
            </BrowserRouter>
        </ThemeProvider>
      </Provider>
  </React.StrictMode>
);

