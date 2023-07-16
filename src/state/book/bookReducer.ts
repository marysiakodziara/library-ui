import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {RootState} from "../../app/store";

export interface Book {
    id: number;
    isbn: number;
    title: string;
    author: string;
    numberOfBooks: number;
    description: string;
    categories: string[];
    count: number;
}

export interface Category {
    [key: string]: string[];
}

export interface BookState {
    books: Book[],
    categories: Category,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    error: string | undefined
}

const initialState: BookState = {
    books: [],
    categories: {},
    status: 'idle',
    error: undefined
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book`)).data;
});

export const fetchCategories = createAsyncThunk('books/fetchCategories', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/categories`)).data;
});

export const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBooks: (state, action) => {
            return action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });

    }
});

export const selectAllBooks = (state: RootState) => state.book.books;
export const selectAllCategories = (state: RootState) => state.book.categories;
export default bookSlice.reducer;