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

export interface CategoryState {
    categories: Category,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
}

export interface HomePageBooks {
    all: {
        books: Book[],
        status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    },
    newArrivals: {
        books: Book[],
        status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    },
    bestsellers: {
        books: Book[],
        status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    }
}

export interface BookState {
    bookPage: BookPage,
    categoriesState: CategoryState ,
    homePageBooks: HomePageBooks,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    error: string | undefined
}

const initialState: BookState = {
    bookPage: {
        content: [],
        totalPages: 0
    },
    categoriesState: {
        categories: {},
        status: 'idle'
    },
    homePageBooks: {
        all: {
            books: [],
            status: 'idle'
        },
        newArrivals: {
            books: [],
            status: 'idle'
        },
        bestsellers: {
            books: [],
            status: 'idle'
        }
    },
    status: 'idle',
    error: undefined
};

export const fetchHomePageBooksAll = createAsyncThunk('books/fetchHomePageBooksAll', async () => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/random?size=12`)).data;
});

export const fetchHomePageBooksNewArrivals = createAsyncThunk('books/fetchHomePageBooksNewArrivals', async () => {
    const path = `${process.env.REACT_APP_API_URL}/book/newArrivals`;

    return (await axios.get(path)).data;
});

export const fetchHomePageBooksBestsellers = createAsyncThunk('books/fetchHomePageBooksBestsellers', async () => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/inCategory?categories=BEST_SELLER&size=12`)).data;
});

export const fetchCategories = createAsyncThunk('books/fetchCategories', async () => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/categories`)).data;
});

export const fetchBooksByCategories = createAsyncThunk('books/fetchBooksByCategories', async ({ categories, page }: { categories: string[]; page: number }) => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/inCategory?categories=${categories}&page=${page}`)).data;
});

export const fetchBooksByPhrase = createAsyncThunk('books/fetchBooksByPhrase', async ({ phrase, page }: { phrase: string; page: number }) => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/filter?phrase=${phrase}&page=${page}`)).data;
});
export const fetchRandomBooks = createAsyncThunk('books/fetchRandomBooks', async () => {
    return (await axios.get(`${process.env.REACT_APP_API_URL}/book/random`)).data;
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
                state.categoriesState.categories = action.payload;
                state.categoriesState.status = 'fulfilled';
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
                    state.homePageBooks.all.books = action.payload.content;
                    state.homePageBooks.all.status = 'fulfilled';
            })
            .addCase(fetchHomePageBooksNewArrivals.fulfilled, (state, action) => {
                state.homePageBooks.newArrivals.books = action.payload;
                state.homePageBooks.newArrivals.status = 'fulfilled';
            })
            .addCase(fetchHomePageBooksBestsellers.fulfilled, (state, action) => {
                state.homePageBooks.bestsellers.books = action.payload.content;
                state.homePageBooks.bestsellers.status = 'fulfilled';
            });
    }
});

export const selectAllBooks = (state: RootState) => state.book.bookPage.content;
export const selectAllBooksTotalPages = (state: RootState) => state.book.bookPage.totalPages;
export const selectAllHomePageBooks = (state: RootState) => state.book.homePageBooks
export const selectAllHomePageStatus = (state: RootState) => state.book.homePageBooks.all.status;
export const selectAllCategories = (state: RootState) => state.book.categoriesState.categories;
export const selectAllCategoriesStatus = (state: RootState) => state.book.categoriesState.status;
export const selectStatus = (state: RootState) => state.book.status;
export default bookSlice.reducer;