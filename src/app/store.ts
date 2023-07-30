import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import cartReducer from '../state/cart/cartReducer';
import bookReducer from '../state/book/bookReducer';
import securityReducer from '../state/security/securityReducer';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        book: bookReducer,
        security: securityReducer,
    }});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
