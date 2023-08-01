import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import axios from "axios";

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

export const fetchRole  = createAsyncThunk('security/fetchRole', async (arg, {getState}) => {
    console.log("called ROLES endpoint");
    const token = selectLoggedUser(getState() as RootState)
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
    return (await axios.get(`http://localhost:8080/api/v1/client/role`, {headers})).data;
});

export const securityReducer = createSlice({
    name: 'security',
    initialState,
    reducers: {
        logout: (state) => {
            sessionStorage.setItem('isUserLogged', 'false');
            state.loggedUser = undefined;
        },
        loginUser: (state, action) => {
            sessionStorage.setItem('isUserLogged', 'true');
            state.loggedUser = {
                tokenAuth0: action.payload,
            };
        },
        initializeSecurity: (state) => {
            if (sessionStorage.getItem('isUserLogged') === 'true') {
                const token = sessionStorage.getItem('tokenAuth0') || '';
                const userRole = sessionStorage.getItem('role') || '';
                state.loggedUser = {
                    tokenAuth0: token,
                };
                state.role = userRole;
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchRole.fulfilled, (state, action) => {
                state.role = action.payload;
            });
    }
});

export default securityReducer.reducer;
export const { logout, loginUser, initializeSecurity } = securityReducer.actions;

export const selectLoggedUser = (state: RootState): string | undefined => state.security.loggedUser?.tokenAuth0;
export const selectRole = (state: RootState): string => state.security.role;