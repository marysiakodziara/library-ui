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

export interface BookPage {
    content: Book[];
    totalPages: number;
}

export interface Category {
    [key: string]: string[];
}

export interface BookState {
    bookPage: BookPage,
    categories: Category,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    error: string | undefined
}

const initialState: BookState = {
    bookPage: {
        content: [],
        totalPages: 0
    },
    categories: {},
    status: 'idle',
    error: undefined
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
    console.log("called BOOKS endpoint");
    return (await axios.get(`http://localhost:8080/api/v1/book`)).data;
});

export const fetchCategories = createAsyncThunk('books/fetchCategories', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/categories`)).data;
});

export const fetchBooksByCategories = createAsyncThunk('books/fetchBooksByCategories', async ({ categories, page }: { categories: string[]; page: number }) => {
    console.log("called CATEGORIES endpoint");
    return (await axios.get(`http://localhost:8080/api/v1/book/inCategory?categories=${categories}&15page=${page}`)).data;
});

export const fetchBooksByPhrase = createAsyncThunk('books/fetchBooksByPhrase', async ({ phrase, page }: { phrase: string; page: number }) => {
    console.log("called FILTER endpoint");
    return (await axios.get(`http://localhost:8080/api/v1/book/filter?phrase=${phrase}&page=${page}`)).data;
});

export const fetchBooksForIndividualView = createAsyncThunk('books/fetchBooksForIndividualView', async ({ id }: { id: number }) => {
    return (await axios.get(`http://localhost:8080/api/v1/book/id?id=${id}`)).data;
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
                state.bookPage = action.payload;
                console.log(state.bookPage.content.length + " books in category");
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchBooksByCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooksByCategories.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.bookPage = action.payload;
            })
            .addCase(fetchBooksByCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchBooksByPhrase.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooksByPhrase.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.bookPage = action.payload;
            })
            .addCase(fetchBooksByPhrase.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchBooksForIndividualView.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooksForIndividualView.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.bookPage = action.payload;
            })
            .addCase(fetchBooksForIndividualView.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const selectAllBooks = (state: RootState) => state.book.bookPage.content;
export const selectAllCategories = (state: RootState) => state.book.categories;
export const selectStatus = (state: RootState) => state.book.status;
export default bookSlice.reducer;