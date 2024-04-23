import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Import Provider từ react-redux
import store from '../redux/store'; // Import Redux store từ tệp store.js
import Home from './Home'; // Đường dẫn đến thành phần chính của ứng dụng
function App() {
    return(
        <Provider store={store}>
            <Home/>
        </Provider>
    );
}
export default App;