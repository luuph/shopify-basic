import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    addressData: [],
    isLoading: false,
    isDirty: false,
};

// Tạo slice cho reducers
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAddressData(state, action) {
            state.addressData = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setIsDirty(state, action) {
            state.isDirty = action.payload;
        },
    },
});

export const { setAddressData, setIsLoading, setIsDirty } = appSlice.actions;

export default appSlice.reducer;
