import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from "../../app/store";
import {Book} from "../book/bookReducer";
import axios from "axios";
import {selectLoggedUser} from "../security/securityReducer";

export interface OrderHistoryItem {
    book: Book,
    quantity: number,
    returned: boolean,
}

export interface BorrowedOrderHistoryItem extends OrderHistoryItem {
    id: number,
    reservationDate: string,
    endOfReservation: string,
}

export interface OrderHistory {
    id: string,
    reservationItems: OrderHistoryItem[],
    reservationDate: string,
    endOfReservation: string,
    borrowed: boolean
    canceled: boolean,
}

export interface OrderHistoryPage {
    content: OrderHistory[] | BorrowedOrderHistoryItem[]
    totalPages: number,
}

export interface TransactionHistoryState {
    orderHistoryPage: OrderHistoryPage,
    status: 'idle' | 'loading' | 'fulfilled' | 'failed',
    error: string | undefined
}


export interface AccountState {
    borrowingHistoryState: TransactionHistoryState,
    reservationHistoryState: TransactionHistoryState,
}

const initialState: AccountState = {
    borrowingHistoryState: {
        orderHistoryPage: {
            content: [],
            totalPages: 0,
        },
        status: 'idle',
        error: undefined
    },
    reservationHistoryState: {
        orderHistoryPage: {
            content: [],
            totalPages: 0,
        },
        status: 'idle',
        error: undefined
    },
}

export const fetchBorrowingHistory = createAsyncThunk('account/fetchBorrowingHistory', async (arg, {getState})  => {
    const token = selectLoggedUser(getState() as RootState)
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    return (await axios.get(`${process.env.REACT_APP_API_URL}/reservation/borrowedItems/forClient`, {headers})).data;
});
export const fetchReservationHistory = createAsyncThunk('account/fetchReservationHistory', async (arg, {getState}) => {
    const token = selectLoggedUser(getState() as RootState)
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    return (await axios.get(`${process.env.REACT_APP_API_URL}/reservation/client?borrowed=false`, {headers} )).data;
});

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBorrowingHistory.pending, (state) => {
                state.borrowingHistoryState.status = 'loading';
            })
            .addCase(fetchBorrowingHistory.fulfilled, (state, action) => {
                state.borrowingHistoryState.status = 'fulfilled';
                state.borrowingHistoryState.orderHistoryPage = action.payload;
            })
            .addCase(fetchBorrowingHistory.rejected, (state, action) => {
                state.borrowingHistoryState.status = 'failed';
                state.borrowingHistoryState.error = action.error.message;
            })
            .addCase(fetchReservationHistory.pending, (state) => {
                state.reservationHistoryState.status = 'loading';
            })
            .addCase(fetchReservationHistory.fulfilled, (state, action) => {
                state.reservationHistoryState.status = 'fulfilled';
                state.reservationHistoryState.orderHistoryPage = action.payload;
            })
            .addCase(fetchReservationHistory.rejected, (state, action) => {
                state.reservationHistoryState.status = 'failed';
                state.reservationHistoryState.error = action.error.message;
            })
    }
});

export const selectAccount = (state: RootState) => state.account;
export const selectBorrowingHistory = (state: RootState) => state.account.borrowingHistoryState.orderHistoryPage.content;
export const selectReservationHistory = (state: RootState) => state.account.reservationHistoryState.orderHistoryPage.content;
export const selectBorrowingHistoryStatus = (state: RootState) => state.account.borrowingHistoryState.status;
export const selectReservationHistoryStatus = (state: RootState) => state.account.reservationHistoryState.status;
export default accountSlice.reducer;