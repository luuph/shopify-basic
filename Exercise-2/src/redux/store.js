import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/appSlice';

const store = configureStore({
    reducer: rootReducer,
});

export default store;
