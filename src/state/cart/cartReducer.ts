import { createSlice } from '@reduxjs/toolkit';
import {RootState} from "../../app/store";
import {Book} from "../book/bookReducer";

export interface OrderItem {
    quantity: number;
    book: Book;
    image: string;
}

export interface Order {
    reservationItems: OrderItem[];
    reservationDate: string;
    endOfReservation: string;
    borrowed: boolean;
}

export interface CartState {
    isCartOpen: boolean;
    cart: OrderItem[];
}

const initialState: CartState = {
    isCartOpen: false,
    cart: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setItems: (state) => {
            const newCart = JSON.parse(localStorage.getItem('cart') || '[]');
            return { ...state, cart: newCart };
        },
        addToCart: (state, action) => {
            if(state.cart.some(item => item.book.id === action.payload.book.id)) {
                const newCart = state.cart.map(item => {
                    if (item.book.id === action.payload.book.id) {
                        return { ...item, quantity: item.quantity + action.payload.quantity };
                    }
                    return item;
                });
                localStorage.setItem('cart', JSON.stringify(newCart));
                return { ...state, cart: newCart };
            } else {
                const newItem: OrderItem = { book: action.payload.book, quantity: action.payload.quantity, image: action.payload.image };
                state.cart.push(newItem);
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }

        },

        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.book.id !== action.payload.id);
            if (state.cart.length === 0) {
                localStorage.removeItem('cart');
            } else {
                localStorage.setItem('cart', JSON.stringify(state.cart));
            }
        },

        increaseCount: (state, action) => {
            const newCart = state.cart.map(item => {
                if (item.book.id === action.payload.id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { ...state, cart: newCart };
        },

        decreaseCount: (state, action) => {
            const newCart = state.cart.map(item => {
                if (item.book.id === action.payload.id && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(newCart));
            return { ...state, cart: newCart };
        },

        setIsCartOpen: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        setCartEmpty: (state) => {
            state.cart = [];
            localStorage.removeItem('cart');
        }
    }
});

export const {
    setItems,
    addToCart,
    removeFromCart,
    increaseCount,
    decreaseCount,
    setIsCartOpen,
    setCartEmpty
} = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectIsCartOpen = (state: RootState) => state.cart.isCartOpen;
export default cartSlice.reducer;