import React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import i18n from './i18n'

const element = (
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(element)


// ReactDOM.render(element, document.getElementById('root'));
