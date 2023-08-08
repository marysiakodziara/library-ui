import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {RootState} from "../../app/store";

export interface Book {
    id: number;
    isbn: number;
    title: string;
    author: string;
    numberOfBooks: number;
    categories: string[];
    count: number;
    numberOfAvailableBooks: number;
}

export interface BookPage {
    content: Book[];
    totalPages: number;
}

export interface Category {
    [key: string]: string[];
}

export interface HomePageBooks {
    all: Book[],
    newArrivals: Book[],
    bestsellers: Book[]
}

export interface BookState {
    bookPage: BookPage,
    categories: Category,
    homePageBooks: HomePageBooks,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    error: string | undefined
}

const initialState: BookState = {
    bookPage: {
        content: [],
        totalPages: 0
    },
    categories: {},
    homePageBooks: {
        all: [],
        newArrivals: [],
        bestsellers: []
    },
    status: 'idle',
    error: undefined
};

export const fetchHomePageBooksAll = createAsyncThunk('books/fetchHomePageBooksAll', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/random?size=12`)).data;
});

export const fetchHomePageBooksNewArrivals = createAsyncThunk('books/fetchHomePageBooksNewArrivals', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/newArrivals`)).data;
});

export const fetchHomePageBooksBestsellers = createAsyncThunk('books/fetchHomePageBooksBestsellers', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/inCategory?categories=BEST_SELLER&15&size=12`)).data;
});

export const fetchCategories = createAsyncThunk('books/fetchCategories', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/categories`)).data;
});

export const fetchBooksByCategories = createAsyncThunk('books/fetchBooksByCategories', async ({ categories, page }: { categories: string[]; page: number }) => {
    return (await axios.get(`http://localhost:8080/api/v1/book/inCategory?categories=${categories}&15page=${page}`)).data;
});

export const fetchBooksByPhrase = createAsyncThunk('books/fetchBooksByPhrase', async ({ phrase, page }: { phrase: string; page: number }) => {
    return (await axios.get(`http://localhost:8080/api/v1/book/filter?phrase=${phrase}&page=${page}`)).data;
});
export const fetchRandomBooks = createAsyncThunk('books/fetchRandomBooks', async () => {
    return (await axios.get(`http://localhost:8080/api/v1/book/random`)).data;
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
            .addCase(fetchRandomBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRandomBooks.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.bookPage = action.payload;
            })
            .addCase(fetchRandomBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchHomePageBooksAll.fulfilled, (state, action) => {
                    state.homePageBooks.all = action.payload.content;
            })
            .addCase(fetchHomePageBooksNewArrivals.fulfilled, (state, action) => {
                state.homePageBooks.newArrivals = action.payload;
            })
            .addCase(fetchHomePageBooksBestsellers.fulfilled, (state, action) => {
                state.homePageBooks.bestsellers = action.payload.content;
            });
    }
});

export const selectAllBooks = (state: RootState) => state.book.bookPage.content;
export const selectAllHomePageBooks = (state: RootState) => state.book.homePageBooks
export const selectAllCategories = (state: RootState) => state.book.categories;
export const selectStatus = (state: RootState) => state.book.status;
export default bookSlice.reducer;