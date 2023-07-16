import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import cartReducer from '../state/cart/cartReducer';
import bookReducer from '../state/book/bookReducer';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        book: bookReducer,
    }});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
