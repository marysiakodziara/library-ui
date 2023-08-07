import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

export interface LoggedUser {
    tokenAuth0: string;
}

export interface SecurityState {
    loggedUser?: LoggedUser;
    role: string;
}

const initialState: SecurityState = {
    loggedUser: undefined,
    role: '',
};

export const securityReducer = createSlice({
    name: 'security',
    initialState,
    reducers: {
        logoutUser: () => {
            sessionStorage.clear();
        },
        loginUser: (state, action) => {
            sessionStorage.setItem('isUserLogged', 'true');
            state.loggedUser = {tokenAuth0: action.payload.token};
            state.role = action.payload.role;
            sessionStorage.setItem('role', action.payload.role);
        },
        initializeSecurity: (state) => {
            state.role = sessionStorage.getItem('role') || '';
        },
    },
});

export default securityReducer.reducer;
export const { logoutUser, loginUser, initializeSecurity } = securityReducer.actions;

export const selectLoggedUser = (state: RootState): string | undefined => state.security.loggedUser?.tokenAuth0;
export const selectRole = (state: RootState): string => state.security.role;