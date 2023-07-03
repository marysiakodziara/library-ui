import { createSlice } from '@reduxjs/toolkit';

export interface Item {
    id: string;
    isbn: number;
    name: string;
    author: string;
    image: string;
    count: number;
    attributes: {
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
    }
}

export interface CartState {
    isCartOpen: boolean;
    cart: Item[];
    items: Item[];
}

const initialState: CartState = {
    isCartOpen: false,
    cart: [],
    items: [],
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addToCart: (state, action) => {
            state.cart = [...state.cart, action.payload.item];
        },

        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload.id);
        },

        increaseCount: (state, action) => {
            const newCart = state.cart.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, count: item.count + 1 };
                }
                return item;
            });
            return { ...state, cart: newCart };
        },

        decreaseCount: (state, action) => {
            const newCart = state.cart.map(item => {
                if (item.id === action.payload.id && item.count > 1) {
                    return { ...item, count: item.count - 1 };
                }
                return item;
            });
            return { ...state, cart: newCart };
        },

        setIsCartOpen: (state) => {
            state.isCartOpen = !state.isCartOpen;
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
} = cartSlice.actions;

export default cartSlice.reducer;